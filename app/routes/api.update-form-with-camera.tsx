import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";

export async function action({ request }: { request: Request }) {
  try {
    const { cameraResults } = await request.json();
    
    if (!cameraResults) {
      return new Response(
        JSON.stringify({ error: 'Camera results are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the user data directory
    const userDataDir = join(process.cwd(), 'user-data');
    const filename = 'user-data.json';
    const filePath = join(userDataDir, filename);
    
    try {
      // Check if the user-data.json file exists
      try {
        await readFile(filePath, 'utf8');
      } catch (e) {
        return new Response(
          JSON.stringify({ error: 'No user data found. Please fill out the form first.' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Read the existing form data
      const existingData = JSON.parse(await readFile(filePath, 'utf8'));
      
      // Add camera results to the existing data
      const updatedData = {
        ...existingData,
        cameraResults: {
          ...cameraResults,
          analysisTimestamp: new Date().toISOString()
        }
      };
      
      // Write the updated data back to the file
      await writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Camera results added to user data successfully',
          filename: filename,
          updatedFields: Object.keys(cameraResults)
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
    } catch (error) {
      console.error('Error updating form data with camera results:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update form data with camera results' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
  } catch (error) {
    console.error('Error processing camera results update:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process camera results update' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
