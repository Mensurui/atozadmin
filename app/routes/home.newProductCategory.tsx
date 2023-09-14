import { redirect, type ActionFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import { FormField } from "~/components/form-field";
import { Modal } from "~/components/modal";
import { createProductCategory } from "~/utils/productCategory.server";

export const action: ActionFunction = async ({ request }) => {
  console.log("Action function executed");
  const form = await request.formData();
  const name = form.get("name");
  const imageUrl = form.get("image_url"); // Get the image URL from the form

  console.log("This is the name"+name)
  console.log("This is the image url"+imageUrl)

  if (typeof name === "string" && imageUrl) {
    try {
      await createProductCategory(name, imageUrl.toString());
      console.log("Product category created");
    } catch (error) {
      console.error("Error creating product category:", error);
    }
  }

  return redirect("/home");
};

async function uploadImage(image: any) {
  const form = new FormData();
  form.append("file", image);
  form.append("upload_preset", "bnuiesbw");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/djv15v3eg/image/upload",
      {
        method: "POST",
        body: form,
      }
    );
    const data = await response.json();
    console.log("Image uploaded:", data.url);
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export default function ProductCategory() {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // State to store the image URL
  const [showNextButton, setShowNextButton] = useState(true);
  const navigate = useNavigate();

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async () => {
    if (image) {
      try {
        const url = await uploadImage(image);
        setImageUrl(url); // Store the image URL in the state
        console.log("Image uploaded:", url);
        setShowNextButton(false); // Hide the "Next" button
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Conditionally render the form based on imageUrl presence
  const renderForm = imageUrl ? (
    <div>
      <form method="post">
        <FormField
          htmlFor="name"
          label="Category Name: "
          onChange={(e) => handleInput(e, "name")}
          error=""
          value={formData.name}
        />
        {JSON.stringify(formData.name + ": " + imageUrl)}
        <input
          name="image_url"
          type="url"
          value={imageUrl}
          readOnly
          style={{ display: "none" }} // Hide the input field
        />
          <button
          type="submit"
          className="left-2 top-3 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 "
          name="_action"
          onClick={() => navigate(`/done`)}
        >
          <span className=" relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-cyan-500 rounded-md group-hover:bg-opacity-0">
          Submit
          </span>
        </button>
      </form>
      {/* <img src={imageUrl} alt="Uploaded Image" /> */}
    </div>
  ) : null;

  return (
    <Modal isOpen={true} className="w-2/3 p-10 flex justify-center">
      {showNextButton && (
        <>
          <input
            type="file"
            onChange={handleImageChange}
          />
          <button onClick={handleSubmit}>Next</button>
        </>
      )}
      {renderForm}
    </Modal>
  );
}
