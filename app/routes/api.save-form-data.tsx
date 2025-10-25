import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.json();
    
    if (!formData) {
      return new Response(
        JSON.stringify({ error: 'Form data is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create user data directory if it doesn't exist
    const userDataDir = join(process.cwd(), 'user-data');
    try {
      await mkdir(userDataDir, { recursive: true });
    } catch (e) {
      // Directory might already exist, that's fine
    }

    // Always use a single user-data.json file
    const filename = 'user-data.json';
    const filePath = join(userDataDir, filename);
    
    // Add metadata to the form data
    const dataWithMetadata = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: `form-${Date.now()}`
    };
    
    // Write the form data to file (overwrites existing file)
    await writeFile(filePath, JSON.stringify(dataWithMetadata, null, 2), 'utf8');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form data saved successfully',
        filename: filename,
        id: dataWithMetadata.id
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error saving form data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save form data' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
