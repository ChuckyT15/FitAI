import { writeFile, readFile } from "fs/promises";
import { join } from "path";

export async function action({ request }: { request: Request }) {
  try {
    const { content, append } = await request.json();
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Write to results.txt in the routes directory
    const routesDir = join(process.cwd(), 'app', 'routes');
    const filePath = join(routesDir, 'results.txt');
    
    let finalContent = content;
    
    // If append is true, read existing content and append
    if (append) {
      try {
        const existingContent = await readFile(filePath, 'utf8');
        finalContent = existingContent + content;
      } catch (e) {
        // File doesn't exist yet, just use the new content
        finalContent = content;
      }
    }
    
    await writeFile(filePath, finalContent, 'utf8');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: append ? 'Form data appended to results.txt' : 'Results written to results.txt'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error writing results.txt:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to write results.txt' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
