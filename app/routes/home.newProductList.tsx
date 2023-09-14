import { redirect, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Modal } from "~/components/modal";
import { SelectBox } from "~/components/select-box";
import { getAllProductNames, getAllProductID, createNewProduct } from "~/utils/product.server";

export const loader: LoaderFunction = async () => {
  try {
    const productNames = await getAllProductNames();
    const productCategoryIds = await getAllProductID();
    console.log("Fetched product names:", productNames);
    return { productListOptions: productNames, productCategoryIds };
  } catch (error) {
    console.error("Error fetching product names:", error);
    throw error;
  }
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const categoryId = form.get("categoryId");
  const imageUrl = form.get("image_url");
  console.log("Here is the name:", name);
  console.log("Here is the categoryId:", categoryId);
  console.log("Here is the imageUrl:", imageUrl);
  if (typeof name === "string" && typeof categoryId === "string" &&  imageUrl ) {
    try {
      await createNewProduct(name, categoryId, imageUrl.toString());
      console.log("Product created");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }
  return redirect('/home');
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

export default function ProductList() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const { productListOptions, productCategoryIds } = data;

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showNextButton, setShowNextButton] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [inputFields, setInputFields] = useState<string[]>([""]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedProduct(selectedValue);

    const selectedIndex = productListOptions.indexOf(selectedValue);
    if (selectedIndex !== -1) {
      const selectedCategoryId = productCategoryIds[selectedIndex];
      setSelectedCategoryId(selectedCategoryId);
    }
  };

  const handleAddInput = () => {
    setInputFields([...inputFields, ""]);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedFields = [...inputFields];
    updatedFields[index] = value;
    setInputFields(updatedFields);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async () => {
    if (image) {
      try {
        const url = await uploadImage(image);
        setImageUrl(url);
        console.log("Image uploaded:", url);
        setShowNextButton(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const renderForm = imageUrl ? (
    <div>
      <form method="post" className="flex flex-col">
        <SelectBox
          options={productListOptions}
          value={selectedProduct}
          onChange={handleProductChange}
          label="Select a Category"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
         <input
          name="image_url"
          type="url"
          value={imageUrl}
          readOnly
          style={{ display: "none" }} // Hide the input field
        />
          
        <input
          type="hidden"
          name="categoryId"
          value={selectedCategoryId}
        />
        {inputFields.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="name"
            placeholder="New product name"
            required
          />
        ))}
        <button onClick={handleAddInput}>Add Input</button>
        {!showNextButton && (
          <button
            type="submit"
            className="left-2 top-3 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
            name="_action"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-cyan-500 rounded-md group-hover:bg-opacity-0">
              Submit
            </span>
          </button>
        )}
      </form>
    </div>
  ) : null;

  return (
    <Modal isOpen={true}>
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
