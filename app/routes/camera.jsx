import React, { useEffect, useRef, useState } from "react";

export default function FitAICameraTab() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const detectorRef = useRef(null);
  const bodypixRef = useRef(null);
  const rafRef = useRef(null);

  const [status, setStatus] = useState("running");
  const [consentGiven, setConsentGiven] = useState(true);
  const [scaleCmPerPixel, setScaleCmPerPixel] = useState(null);
  const [knownHeightCm, setKnownHeightCm] = useState(175);
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [prompt, setPrompt] = useState("Step into view & pose so your torso is visible — show shoulders, hips and at least one ankle");
  const [useSegmentation, setUseSegmentation] = useState(true);

  // countdown state (null = not counting)
  const [countdownRemaining, setCountdownRemaining] = useState(null);
  const inBoxSinceRef = useRef(null);
  const triggeredRef = useRef(false);
  const COUNTDOWN_MS = 3000; // milliseconds to hold still

  // movement-tolerant accumulation
  const prevPoseRef = useRef(null);
  const accumulatedStableRef = useRef(0); // ms of stable time accumulated while centered
  const lastLoopTimeRef = useRef(Date.now());

  // ---------- dynamic script loading ----------
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(s);
    });

  const ensureScripts = async () => {
    if (!window.tf)
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js");
    if (!window.poseDetection)
      await loadScript(
        "https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js"
      );
    if (useSegmentation && !window.bodyPix) {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0.5/dist/body-pix.min.js"
        );
      } catch (e) {
        console.warn("BodyPix failed to load, continuing without segmentation");
        bodypixRef.current = null;
      }
    }
  };

  const loadModel = async () => {
    const model = window.poseDetection.SupportedModels.MoveNet;
    detectorRef.current = await window.poseDetection.createDetector(model, {
      modelType: window.poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    });
    if (window.bodyPix) {
      try {
        bodypixRef.current = await window.bodyPix.load();
      } catch {
        bodypixRef.current = null;
      }
    }
  };

  // ---------- camera ----------
  const startCamera = async () => {
    setStatus("starting camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      const v = videoRef.current;
      v.srcObject = stream;
      v.muted = true;
      v.playsInline = true;

      await new Promise((res) => {
        if (v.readyState >= 2) res();
        else v.addEventListener("loadedmetadata", res, { once: true });
      });

      await v.play();
      setStatus("camera-ready");

      // ensure canvas matches initial video/container size
      syncCanvasSize();
    } catch (e) {
      console.error("startCamera error", e);
      setStatus("error");
      setPrompt("Camera error: " + (e.message || "Unknown"));
    }
  };

  const stopCamera = () => {
    const v = videoRef.current;
    if (v?.srcObject) v.srcObject.getTracks().forEach((t) => t.stop());
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStatus("stopped");
    setPrompt("Stopped");
    // reset countdown/trigger and accumulation
    inBoxSinceRef.current = null;
    setCountdownRemaining(null);
    triggeredRef.current = false;
    accumulatedStableRef.current = 0;
    prevPoseRef.current = null;
    lastLoopTimeRef.current = Date.now();
  };

  useEffect(() => stopCamera, []);


  // ---------- canvas & sizing ----------
  const syncCanvasSize = () => {
    const container = containerRef.current;
    const c = canvasRef.current;
    if (!container || !c) return;
    const dpr = window.devicePixelRatio || 1;

    // base sizes from the container (this guarantees video & canvas occupy same box)
    const rect = container.getBoundingClientRect();
    const cssW = Math.max(1, Math.round(rect.width));
    const cssH = Math.max(1, Math.round(rect.height));

    // set CSS/display size for canvas
    c.style.width = `${cssW}px`;
    c.style.height = `${cssH}px`;

    // internal buffer sized for DPR
    c.width = Math.round(cssW * dpr);
    c.height = Math.round(cssH * dpr);

    // normalize drawing to CSS pixels
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  useEffect(() => {
    // run sync initially and on window resize
    const onResize = () => syncCanvasSize();
    window.addEventListener("resize", onResize);
    syncCanvasSize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Helper: compute transform from video intrinsic pixels -> canvas CSS pixels
  const computeVideoToCanvasTransform = () => {
    const container = containerRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!container || !video || !canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const canvasCssW = canvas.width / dpr;
    const canvasCssH = canvas.height / dpr;

    // intrinsic video size (frame)
    const vidW = (video.videoWidth && video.videoWidth > 0) ? video.videoWidth : video.clientWidth || canvasCssW;
    const vidH = (video.videoHeight && video.videoHeight > 0) ? video.videoHeight : video.clientHeight || canvasCssH;

    // object-fit: cover scaling — scale until one dimension fits then crop other
    const scale = Math.max(canvasCssW / vidW, canvasCssH / vidH);

    const displayedWidth = vidW * scale;
    const displayedHeight = vidH * scale;

    // center offset inside the canvas because 'cover' centers and crops
    const offsetX = (canvasCssW - displayedWidth) / 2;
    const offsetY = (canvasCssH - displayedHeight) / 2;

    return { scale, offsetX, offsetY, canvasCssW, canvasCssH, vidW, vidH };
  };

  const drawGuidanceBox = (ctx) => {
    const dpr = window.devicePixelRatio || 1;
    const cssW = ctx.canvas.width / dpr;
    const cssH = ctx.canvas.height / dpr;
    const w = Math.round(cssW * 0.5);
    const h = Math.round(cssH * 0.7);
    const x = Math.round((cssW - w) / 2);
    const y = Math.round((cssH - h) / 2);
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,215,0,0.9)";
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    ctx.restore();
    return { x, y, width: w, height: h };
  };

  // robust mapper: handles normalized (<=1) and pixel coords
  const mapX = (rawX, t) => {
    const intrinsicX = rawX <= 1.01 ? rawX * t.vidW : rawX;
    return intrinsicX * t.scale + t.offsetX;
  };
  const mapY = (rawY, t) => {
    const intrinsicY = rawY <= 1.01 ? rawY * t.vidH : rawY;
    return intrinsicY * t.scale + t.offsetY;
  };

  const drawOverlay = (ctx, keypoints) => {
    if (!ctx) return;
    const canvas = ctx.canvas;
    const video = videoRef.current;
    if (!video) return;

    // ensure canvas size is up-to-date (protect against layout changes)
    syncCanvasSize();

    // clear (device pixels)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw guidance if no keypoints
    if (!keypoints || !keypoints.length) {
      // show a prominent instruction to pose
      const dpr = window.devicePixelRatio || 1;
      const canvasCssW = canvas.width / dpr;
      ctx.save();
      ctx.font = "20px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.textAlign = "center";
      ctx.fillText("Step into view and pose so your torso fits the box", canvasCssW / 2, 40);
      ctx.restore();
      drawGuidanceBox(ctx);
      return;
    }

    const t = computeVideoToCanvasTransform();
    if (!t) return;

    const box = drawGuidanceBox(ctx);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FFD700";
    ctx.fillStyle = "#00FFFF";
    ctx.shadowBlur = 6;
    ctx.shadowColor = "#FFD700";

    const drawPoint = (x, y, r = 6) => {
      ctx.beginPath();
      ctx.arc(mapX(x, t), mapY(y, t), r, 0, Math.PI * 2);
      ctx.fill();
    };

    keypoints.forEach((k) => {
      if (k.score > 0.15) drawPoint(k.x, k.y);
    });

    const pairs = [
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"],
      ["right_hip", "right_knee"],
      ["left_knee", "left_ankle"],
      ["right_knee", "right_ankle"],
    ];

    const getK = (name) => keypoints.find((p) => p.name === name);

    pairs.forEach(([a, b]) => {
      const A = getK(a);
      const B = getK(b);
      if (A && B && A.score > 0.15 && B.score > 0.15) {
        ctx.beginPath();
        ctx.moveTo(mapX(A.x, t), mapY(A.y, t));
        ctx.lineTo(mapX(B.x, t), mapY(B.y, t));
        ctx.stroke();
      }
    });

    const leftShoulder = getK("left_shoulder");
    const rightShoulder = getK("right_shoulder");
    const leftHip = getK("left_hip");
    const rightHip = getK("right_hip");

    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const midX = (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4;
      const midY = (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;
      const mappedX = mapX(midX, t);
      const mappedY = mapY(midY, t);
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.9)";

      const inBox =
        mappedX > box.x &&
        mappedX < box.x + box.width &&
        mappedY > box.y &&
        mappedY < box.y + box.height;

      // Draw readable (unmirrored) centered text at top middle
      const dpr = window.devicePixelRatio || 1;
      const canvasCssW = ctx.canvas.width / dpr;
      ctx.save();
      ctx.translate(canvasCssW, 0);
      ctx.scale(-1, 1);
      ctx.textAlign = "center";

      // show countdown prominently if active
      if (countdownRemaining !== null) {
        ctx.font = "28px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.98)";
        ctx.fillText(`Hold still: ${countdownRemaining}s`, canvasCssW / 2, 40);
      } else {
        // clear instruction depending on inBox
       // ctx.font = "18px sans-serif";
       // ctx.fillStyle = "rgba(255,255,255,0.95)";
       // ctx.fillText(inBox ? "In position — hold still to capture" : "Move to box to align your torso", canvasCssW / 2, 30);
      }

      ctx.restore();
    }
  };

  const isPoseConfident = (kp) => {
    if (!kp?.length) return false;
    const required = ["nose", "left_shoulder", "right_shoulder", "left_hip", "right_hip"];
    const hasNeeded = required.every((n) => kp.find((k) => k.name === n && k.score > 0.35));
    const hasAnkle = kp.find((k) => (k.name === "left_ankle" || k.name === "right_ankle") && k.score > 0.25);
    return hasNeeded && !!hasAnkle;
  };

  const isCenteredInGuidance = (kp) => {
    if (!kp?.length || !canvasRef.current || !videoRef.current) return false;
    const t = computeVideoToCanvasTransform();
    if (!t) return false;

    const c = canvasRef.current;
    const box = {
      x: c.width / (window.devicePixelRatio || 1) * 0.25,
      y: c.height / (window.devicePixelRatio || 1) * 0.15,
      width: c.width / (window.devicePixelRatio || 1) * 0.5,
      height: c.height / (window.devicePixelRatio || 1) * 0.7,
    };
    const leftShoulder = kp.find((k) => k.name === "left_shoulder");
    const rightShoulder = kp.find((k) => k.name === "right_shoulder");
    const leftHip = kp.find((k) => k.name === "left_hip");
    const rightHip = kp.find((k) => k.name === "right_hip");
    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return false;
    const midXIntrinsic = (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4;
    const midYIntrinsic = (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;

    const midX = mapX(midXIntrinsic, t);
    const midY = mapY(midYIntrinsic, t);

    return midX > box.x && midX < box.x + box.width && midY > box.y && midY < box.y + box.height;
  };

  // helper: compute max displacement between prev and curr on important joints
  const maxFrameDisplacement = (prev, curr) => {
    if (!prev || !curr) return Infinity;
    const names = ["nose","left_shoulder","right_shoulder","left_hip","right_hip","left_ankle","right_ankle"];
    let maxD = 0;
    for (const n of names) {
      const P = prev[n];
      const C = curr[n];
      if (!P || !C) continue;
      const d = Math.hypot(P.x - C.x, P.y - C.y);
      if (d > maxD) maxD = d;
    }
    return maxD;
  };

  // --- new helpers for muscle estimation ---
  const angleBetween = (A, B, C) => {
    // angle at B between BA and BC, returns degrees
    if (!A || !B || !C) return null;
    const v1 = { x: A.x - B.x, y: A.y - B.y };
    const v2 = { x: C.x - B.x, y: C.y - B.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.hypot(v1.x, v1.y);
    const mag2 = Math.hypot(v2.x, v2.y);
    if (mag1 === 0 || mag2 === 0) return null;
    const cos = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
    return (Math.acos(cos) * 180) / Math.PI;
  };

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const estimateMuscleScores = (kpMap) => {
    // kpMap is object with named joints: { nose: {x,y}, left_shoulder: {...}, ... }
    // We will return scores 0-100 for: shoulders, biceps, triceps, chest, back, legs
    // Heuristics (rough / approximate):
    // - shoulders: average shoulder keypoint confidence
    // - biceps: arm flexion (elbow angle) + shoulder/elbow/wrist visibility
    // - triceps: complement to biceps (arm extension) + visibility
    // - chest: shoulder width relative to torso height (wider shoulders -> higher chest presence) * visibility
    // - back: torso symmetry/alignment between shoulder-mid and hip-mid (more centered -> better)
    // - legs: average hip/knee/ankle visibility

    const scoreFromScores = (arr) => {
      const valid = arr.filter((v) => typeof v === "number");
      if (!valid.length) return 0;
      return valid.reduce((s, v) => s + v, 0) / valid.length;
    };

    const getScore = (name) => {
      const item = kpMap[name];
      return item && typeof item.score === "number" ? item.score : 0;
    };

    // build convenience references
    const Ls = kpMap["left_shoulder"];
    const Rs = kpMap["right_shoulder"];
    const Le = kpMap["left_elbow"];
    const Re = kpMap["right_elbow"];
    const Lw = kpMap["left_wrist"];
    const Rw = kpMap["right_wrist"];
    const Lh = kpMap["left_hip"];
    const Rh = kpMap["right_hip"];
    const Lk = kpMap["left_knee"];
    const Rk = kpMap["right_knee"];
    const La = kpMap["left_ankle"];
    const Ra = kpMap["right_ankle"];

    // shoulders
    const shouldersVis = (getScore("left_shoulder") + getScore("right_shoulder")) / 2;
    const shouldersScore = Math.round(clamp01(shouldersVis) * 100);

    // arm angles (elbow angle)
    const leftElbowAngle = angleBetween(Ls, Le, Lw); // angle at elbow
    const rightElbowAngle = angleBetween(Rs, Re, Rw);

    // flexness: 0 => fully extended (~180), 1 => fully flexed (~30)
    const mapFlex = (angle) => {
      if (angle == null) return 0;
      return clamp01((180 - angle) / 150); // map range 30..180 -> ~1..0
    };

    const leftFlex = mapFlex(leftElbowAngle);
    const rightFlex = mapFlex(rightElbowAngle);

    const leftArmVis = (getScore("left_shoulder") + getScore("left_elbow") + getScore("left_wrist")) / 3;
    const rightArmVis = (getScore("right_shoulder") + getScore("right_elbow") + getScore("right_wrist")) / 3;

    const bicepsRaw = (leftFlex * leftArmVis + rightFlex * rightArmVis) / ( (leftArmVis||rightArmVis) ? 1 : 1 );
    // if both arms missing, bicepsRaw may be NaN: guard
    const bicepsScore = Math.round(clamp01(( (leftFlex*leftArmVis) + (rightFlex*rightArmVis) ) / ( (leftArmVis>0?1:0) + (rightArmVis>0?1:0) || 1 )) * 100);

    // triceps: more extended arms => higher triceps relative score
    const leftExt = leftElbowAngle != null ? clamp01((leftElbowAngle - 30) / 150) : 0;
    const rightExt = rightElbowAngle != null ? clamp01((rightElbowAngle - 30) / 150) : 0;
    const tricepsScore = Math.round(clamp01((leftExt * leftArmVis + rightExt * rightArmVis) / ( (leftArmVis>0?1:0) + (rightArmVis>0?1:0) || 1 )) * 100);

    // chest: shoulder width relative to torso height
    // compute shoulder distance and torso height (avg shoulders to avg hips)
    let shoulderDist = null;
    let torsoHeight = null;
    if (Ls && Rs) shoulderDist = Math.hypot(Ls.x - Rs.x, Ls.y - Rs.y);
    if ( (Ls && Rs) && (Lh && Rh) ) {
      const shoulderMidY = (Ls.y + Rs.y)/2;
      const hipMidY = (Lh.y + Rh.y)/2;
      torsoHeight = Math.abs(hipMidY - shoulderMidY);
    }
    let chestScore = 0;
    if (shoulderDist && torsoHeight && torsoHeight > 0) {
      // normalized shoulder-to-torso ratio (typical ~0.6-1.0); we map to 0..1
      const ratio = shoulderDist / torsoHeight;
      // prefer ratio around 0.8-1.2; clamp sensibly
      const norm = clamp01((ratio - 0.5) / 0.8);
      const avgVis = (getScore("left_shoulder") + getScore("right_shoulder") + getScore("left_hip") + getScore("right_hip")) / 4;
      chestScore = Math.round(norm * avgVis * 100);
    }

    // back: torso alignment (mid-shoulder vs mid-hip horizontal offset)
    let backScore = 0;
    if (Ls && Rs && Lh && Rh && shoulderDist) {
      const shoulderMidX = (Ls.x + Rs.x)/2;
      const hipMidX = (Lh.x + Rh.x)/2;
      const offset = Math.abs(shoulderMidX - hipMidX);
      const normalizedOffset = clamp01(offset / Math.max(shoulderDist, 1)); // 0 aligned -> 0, 1 large offset
      const avgVis = (getScore("left_shoulder") + getScore("right_shoulder") + getScore("left_hip") + getScore("right_hip")) / 4;
      backScore = Math.round((1 - normalizedOffset) * avgVis * 100);
    }

    // legs: average visibility of hip/knee/ankle
    const leftLegVis = (getScore("left_hip") + getScore("left_knee") + getScore("left_ankle")) / 3;
    const rightLegVis = (getScore("right_hip") + getScore("right_knee") + getScore("right_ankle")) / 3;
    const legsScore = Math.round(clamp01((leftLegVis + rightLegVis) / 2) * 100);

    // ensure numbers are finite
    const safe = (v) => Number.isFinite(v) ? v : 0;

    return {
      shoulders: safe(shouldersScore),
      biceps: safe(bicepsScore),
      triceps: safe(tricepsScore),
      chest: safe(chestScore),
      back: safe(backScore),
      legs: safe(legsScore),
      // expose some raw useful internals (optional)
      _debug: {
        leftElbowAngle: leftElbowAngle == null ? null : Number(leftElbowAngle.toFixed(1)),
        rightElbowAngle: rightElbowAngle == null ? null : Number(rightElbowAngle.toFixed(1)),
        shoulderDist: shoulderDist == null ? null : Number((shoulderDist).toFixed(1)),
        torsoHeight: torsoHeight == null ? null : Number((torsoHeight).toFixed(1)),
      }
    };
  };

  const measurementLoop = async () => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!detectorRef.current || !video || video.readyState < 2 || !ctx) {
        rafRef.current = requestAnimationFrame(measurementLoop);
        return;
      }

      // IMPORTANT: we visually mirror the video/canvas, so request unmirrored coordinates.
      // Many people find flipHorizontal:false less error-prone when mirroring visually.
      const poses = await detectorRef.current.estimatePoses(video, { maxPoses: 1, flipHorizontal: false });

      let keypoints = [];
      if (poses?.[0]?.keypoints?.length) {
        const names = [
          "nose","left_eye","right_eye","left_ear","right_ear",
          "left_shoulder","right_shoulder","left_elbow","right_elbow",
          "left_wrist","right_wrist","left_hip","right_hip",
          "left_knee","right_knee","left_ankle","right_ankle"
        ];
        keypoints = poses[0].keypoints.map((k, i) => ({ ...k, name: names[i] }));
      }

      // ensure canvas is current size and draw
      syncCanvasSize();
      drawOverlay(ctx, keypoints);

      // compute whether we are confident & centered this frame
      const confident = isPoseConfident(keypoints);
      const inBoxNow = confident && isCenteredInGuidance(keypoints);

      // time delta
      const now = Date.now();
      const dt = Math.max(0, now - (lastLoopTimeRef.current || now));
      lastLoopTimeRef.current = now;

      // prepare simple current pose map for displacement checks (intrinsic coords + keep score)
      const currPoseMap = {};
      for (const k of keypoints) currPoseMap[k.name] = { x: k.x, y: k.y, score: k.score };

      // determine per-frame displacement threshold dynamically:
      // use video width to create a small threshold (allows tiny jitter)
      const t = computeVideoToCanvasTransform();
      const perFrameThresh = t ? Math.max(3, t.vidW * 0.004) : 6; // pixels in intrinsic video space

      if (inBoxNow && !triggeredRef.current) {
        // compute max displacement since prev frame
        const prevPoseSimple = prevPoseRef.current ? Object.fromEntries(Object.entries(prevPoseRef.current).map(([k,v])=>[k,{x:v.x,y:v.y}])) : null;
        const maxDisp = maxFrameDisplacement(prevPoseSimple, currPoseMap);

        if (maxDisp <= perFrameThresh) {
          // this frame is "stable" — accumulate stable time
          accumulatedStableRef.current += dt;
        } else {
          // movement above per-frame threshold: do not add to accumulator
          // (we don't fully reset accumulator so small intermittent motion is tolerated)
        }

        // update countdownRemaining using accumulatedStableRef
        const remainingMs = Math.max(0, COUNTDOWN_MS - accumulatedStableRef.current);
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        setCountdownRemaining(remainingSeconds === 0 ? 0 : remainingSeconds);

        if (accumulatedStableRef.current >= COUNTDOWN_MS) {
          // trigger once
          triggeredRef.current = true;
          setCountdownRemaining(0);
          setPrompt("Captured — preparing metrics...");

          // build minimal pose summary
          const kpMapForMetrics = {};
          for (const k of keypoints) kpMapForMetrics[k.name] = { x: k.x, y: k.y, score: k.score };

          const metricsPoseSummary = {
            nose: kpMapForMetrics.nose ? { x: kpMapForMetrics.nose.x, y: kpMapForMetrics.nose.y, score: kpMapForMetrics.nose.score } : null,
            leftAnkle: kpMapForMetrics.left_ankle ? { x: kpMapForMetrics.left_ankle.x, y: kpMapForMetrics.left_ankle.y, score: kpMapForMetrics.left_ankle.score } : null,
            rightAnkle: kpMapForMetrics.right_ankle ? { x: kpMapForMetrics.right_ankle.x, y: kpMapForMetrics.right_ankle.y, score: kpMapForMetrics.right_ankle.score } : null,
            leftShoulder: kpMapForMetrics.left_shoulder ? { x: kpMapForMetrics.left_shoulder.x, y: kpMapForMetrics.left_shoulder.y, score: kpMapForMetrics.left_shoulder.score } : null,
            rightShoulder: kpMapForMetrics.right_shoulder ? { x: kpMapForMetrics.right_shoulder.x, y: kpMapForMetrics.right_shoulder.y, score: kpMapForMetrics.right_shoulder.score } : null,
            leftHip: kpMapForMetrics.left_hip ? { x: kpMapForMetrics.left_hip.x, y: kpMapForMetrics.left_hip.y, score: kpMapForMetrics.left_hip.score } : null,
            rightHip: kpMapForMetrics.right_hip ? { x: kpMapForMetrics.right_hip.x, y: kpMapForMetrics.right_hip.y, score: kpMapForMetrics.right_hip.score } : null,
          };

          // estimate muscle scores
          const muscleEstimates = estimateMuscleScores(kpMapForMetrics);

          const metrics = {
            method: "auto_hold",
            scaleCmPerPixel: scaleCmPerPixel ?? null,
            knownHeightCm: scaleCmPerPixel ? knownHeightCm : null,
            timestamp: new Date().toISOString(),
            poseSummary: metricsPoseSummary,
            muscleEstimates, // new section with shoulders, biceps, triceps, chest, back, legs (0-100)
          };

          // save metrics in state (so Export JSON button works)
          setLatestMetrics(metrics);

          // automatic JSON download
          try {
            const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `fitai_metrics_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          } catch (e) {
            console.warn("Auto download failed", e);
          }

          // post metrics and navigate
          postMetricsAndNavigate(metrics);
        }
      } else {
        // not in box: reset accumulation (keeps ability to start fresh when re-entering)
        accumulatedStableRef.current = 0;
        setCountdownRemaining(null);
      }

      // update prev pose for next-frame movement check
      prevPoseRef.current = currPoseMap;

      // update small text prompt (keeps changing live)
      // If countdown isn't active, show actionable tips instead of a generic message
      if (countdownRemaining === null || countdownRemaining === undefined) {
        if (!isPoseConfident(keypoints)) setPrompt("Step into view & pose so your torso is visible — show shoulders, hips and at least one ankle");
        else if (!isCenteredInGuidance(keypoints)) setPrompt("Move to the center of the box and keep torso facing camera");
        else if (!scaleCmPerPixel) setPrompt("In position — calibrate (card/height) or hold still to auto-capture");
        else if (!triggeredRef.current) setPrompt("In position — hold still to continue");
      } else {
        // when countdown active keep the "hold still" message
        setPrompt("In position — hold still to capture");
      }

      rafRef.current = requestAnimationFrame(measurementLoop);
    } catch (e) {
      console.error("measurementLoop error", e);
      rafRef.current = requestAnimationFrame(measurementLoop);
    }
  };

  // ---------- helper to post metrics and navigate ----------
  const postMetricsAndNavigate = async (metrics) => {
    // Save locally too (redundant but safe)
    setLatestMetrics(metrics);

    // Replace this URL with your ML endpoint that accepts the metrics JSON.
    const endpoint = "/api/receiveMetrics"; // <-- change me
    // Replace this with the route you want to navigate to after calibration.
    const nextUrl = "/next"; // <-- change me

    try {
      setPrompt("Sending metrics...");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metrics),
      });
      if (!res.ok) {
        console.warn("Server rejected metrics", res.status);
        setPrompt("Metrics sent (server returned error). Navigating anyway...");
      } else {
        setPrompt("Metrics sent. Redirecting...");
      }
    } catch (e) {
      console.warn("Failed to post metrics", e);
      setPrompt("Failed to send metrics. Redirecting anyway...");
    }

    // navigate to the next page (will reload the app if needed)
    window.location.href = "/home";
  };

  // ---------- UI handlers ----------
  const handleStart = async () => {
    // Reset capture state so countdown can run fresh
    triggeredRef.current = false;
    inBoxSinceRef.current = null;
    accumulatedStableRef.current = 0;
    prevPoseRef.current = null;
    lastLoopTimeRef.current = Date.now();
    setCountdownRemaining(null);

    setStatus("loading");
    setPrompt("Loading models...");
    try {
      await ensureScripts();
      await loadModel();
      await startCamera();
      setStatus("running");
      setPrompt("Move into the box");
      rafRef.current = requestAnimationFrame(measurementLoop);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setPrompt("Failed to load models or camera");
    }
  };

  // Auto-start camera on mount
  useEffect(() => {
    const autoStart = () => {
      setTimeout(() => {
        handleStart();
      }, 1000);
    };
    autoStart();
  }, []);

  const handleCalibrateCard = () => {
    const assumedPx = canvasRef.current?.width ? canvasRef.current.width / (window.devicePixelRatio || 1) * 0.34 : 220;
    const newScale = 8.56 / assumedPx;
    setScaleCmPerPixel(newScale);
    setPrompt("Calibrated using card (approx).");

    const metrics = {
      method: "card",
      scaleCmPerPixel: newScale,
      knownHeightCm,
      timestamp: new Date().toISOString(),
    };
    postMetricsAndNavigate(metrics);
  };

  const handleCalibrateHeight = async () => {
    if (!detectorRef.current || !videoRef.current) return alert("Start camera first");
    try {
      const poses = await detectorRef.current.estimatePoses(videoRef.current, { maxPoses: 1, flipHorizontal: false });
      if (!poses?.length) return alert("No person detected for height calibration");
      const kp = poses[0].keypoints;
      const names = [
        "nose","left_eye","right_eye","left_ear","right_ear",
        "left_shoulder","right_shoulder","left_elbow","right_elbow",
        "left_wrist","right_wrist","left_hip","right_hip",
        "left_knee","right_knee","left_ankle","right_ankle"
      ];
      const named = kp.map((k, i) => ({ ...k, name: names[i] }));
      const nose = named.find((k) => k.name === "nose");
      const leftAnkle = named.find((k) => k.name === "left_ankle");
      const rightAnkle = named.find((k) => k.name === "right_ankle");
      const ankle = (leftAnkle?.score ?? 0) > (rightAnkle?.score ?? 0) ? leftAnkle : rightAnkle;
      if (!nose || !ankle || nose.score < 0.2 || ankle.score < 0.2) return alert("Could not detect top/bottom reliably");
      const pixel = Math.hypot(nose.x - ankle.x, nose.y - ankle.y);
      const newScale = knownHeightCm / pixel;
      setScaleCmPerPixel(newScale);
      setPrompt("Calibrated by height");

      const metrics = {
        method: "height",
        scaleCmPerPixel: newScale,
        knownHeightCm,
        pixelHeightPx: pixel,
        poseSummary: {
          nose: { x: nose.x, y: nose.y, score: nose.score },
          ankle: { x: ankle.x, y: ankle.y, score: ankle.score },
        },
        timestamp: new Date().toISOString(),
      };
      postMetricsAndNavigate(metrics);
    } catch (e) {
      console.error(e);
      alert("Height calibration failed");
    }
  };

  const exportMetrics = () => {
    if (!latestMetrics) return;
    const blob = new Blob([JSON.stringify(latestMetrics, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitai_metrics_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- Render ----------
  // Container is now full-screen so video + canvas fill viewport.
  // The UI controls are rendered as a small overlay on the right so you can still interact.
  return (
    <div className="p-0 m-0">
      {/* Fullscreen camera container */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          overflow: "hidden",
          backgroundColor: "black",
          zIndex: 0,
        }}
      >
        <video
          ref={videoRef}
          className="absolute top-0 left-0"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            transform: "scaleX(-1)",
          }}
        />
        <canvas ref={maskCanvasRef} style={{ display: "none" }} />
      </div>

       {/* Controls overlay (centered) */}
       <div
         style={{
           position: "fixed",
           left: "50%",
           top: 16,
           transform: "translateX(-50%)",
           width: 600,
           maxWidth: "calc(100vw - 32px)",
           zIndex: 20,
           background: "rgba(255,255,255,0.75)",
           borderRadius: 12,
           padding: 16,
           boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
         }}
       >
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">FitAI Scan</h2>
        <p className="text-sm font-bold text-gray-800 mb-2 text-center">Stand inside the frame and stay still for 3 seconds to record your measurements</p>

        {countdownRemaining !== null && (
          <div className="text-center">
            <p className="text-xl font-bold text-black">Hold still: {countdownRemaining}s</p>
          </div>
        )}




      </div>
    </div>
  );
}
