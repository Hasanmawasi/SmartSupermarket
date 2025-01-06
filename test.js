import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';
import db from "./server/config/db.js";

// Google Cloud Storage setup
const storage = new Storage({ projectId: 'mindful-server-446821-n5', keyFilename: 'service_account.json' });
const bucketName = 'taswa'; // Your bucket name
const bucket = storage.bucket(bucketName);

// Function to upload image to Google Cloud Storage
async function uploadImage(filePath, destination) {
  console.log(`Uploading file from path: ${filePath}`);

  // Ensure the file exists locally
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Upload the image to Google Cloud Storage
  await bucket.upload(filePath, {
    destination: destination, // Destination path in the bucket
  });

  console.log(`${filePath} uploaded to ${bucketName}`);
  return `https://storage.googleapis.com/${bucketName}${destination}`;
}

// Function to update the image URL in the database
const updateDatabaseWithNewImageUrl = (imageId, newUrl) => {
  const query = 'UPDATE product SET image_url = $1 WHERE product_id = $2';
  const values = [newUrl, imageId];

  db.query(query, values, (err, res) => {
    if (err) {
      console.error('Error updating the database: ', err);
    } else {
      console.log(`Updated image URL for image ID ${imageId}`);
    }
  });
};

// Main process
const processImages = async () => {
  try {
    // Step 1: Fetch all local image URLs from the database
    const result = await db.query('SELECT product_id, image_url FROM product');
    const rows = result.rows;
    console.log('Fetched product data: ', rows);

    // Step 2: Loop through each image and upload it to GCS
    for (const row of rows) {
      const { product_id, image_url } = row;

      try {
        // Assuming image_url contains the relative path from 'public/image/productImg/'
        const localImagePath = path.join('C:', 'Users', 'User', 'Desktop', 'TasawaQ', 'public', image_url);
        const destination = `${image_url}`;

        // Upload the image and get the new URL from GCS
        let newUrl = await uploadImage(localImagePath, destination);

        // Update the image URL in the database
        await updateDatabaseWithNewImageUrl(product_id, newUrl);
      } catch (uploadError) {
        console.error(`Error uploading image ${image_url}: `, uploadError);
      }
    }

  } catch (error) {
    console.error('Error processing images: ', error);
  } finally {
    db.end();
  }
};

// Run the process
processImages();
