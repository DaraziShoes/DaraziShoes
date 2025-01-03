// Replace with your actual API key
const API_KEY = "1d07bcc5ef8dfc7585393ab37c105cd6";

// Function to handle the file upload
document.getElementById("uploadButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image file to upload.");
    return;
  }

  try {
    // Create FormData object to hold the image file
    const formData = new FormData();
    formData.append("image", file);

    // Send POST request to the imgbb API
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: "POST",
      body: formData,
    });

    // Parse the JSON response
    const result = await response.json();

    if (result.success) {
      console.log("Image uploaded successfully:", result.data);
      console.log("Viewer URL:", result.data.url_viewer);
      console.log("Direct URL:", result.data.url);
      alert(`Image uploaded successfully! Viewer URL: ${result.data.url_viewer}`);
    } else {
      console.error("Failed to upload image:", result);
      alert("Failed to upload image. Please try again.");
    }
  } catch (error) {
    console.error("Error while uploading image:", error);
    alert("An error occurred while uploading the image. Please try again.");
  }
});
