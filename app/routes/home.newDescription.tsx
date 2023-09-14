import { type ActionFunction, redirect, type LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Modal } from "~/components/modal";
import { createProductDescription } from "~/utils/description.server";
import { db } from "~/utils/prisma.server";

export let loader: LoaderFunction = async () => {
  const items = await db.product.findMany();
  const categories = await db.productCategory.findMany();

  return json({ items, categories });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const productId = form.get('productId');
  const descriptionText = form.get('description_text');
  const descriptionPercentage = form.get('description_percentage');
  
  if (typeof productId === "string" && typeof descriptionText === "string" && typeof descriptionPercentage === "string") {
    try {
      await createProductDescription(descriptionText, descriptionPercentage, productId);
      console.log(
        "This is the product_id:", productId,
        "This is the description of the product:", descriptionText
      );
    } catch (error) {
      console.error("Error creating product description:", error);
      throw error;
    }
  }
  return redirect('/home');
};

export default function Description(props: any) {
  const [currentCategory, setCategory] = useState(null);
  const [productList, setProductList] = useState([]);
  const [currentProduct, setProduct] = useState(null);
  const [descriptionText, setDescriptionText] = useState(""); // Track description text

  useEffect(() => {
    if (productList.length === 0) {
      setProductList(data.items);
      setProductList(data.items.filter((p: any) => p.category_id === currentCategory));
    } else {
      setProductList(data.items.filter((p: any) => p.category_id === currentCategory));
    }
  }, [currentCategory]);

  const updateCategory = (e: any) => {
    setCategory(e.target.value);
    // Reset the selected product when the category changes
    setProduct(null);
  };

  const updateProduct = (e: any) => {
    setProduct(e.target.value);
    console.log("Selected product_id:", e.target.value);
  };

  let data = useLoaderData();
  console.log(data.categories);

  const navigate = useNavigate()


  return (
    <>
      <Modal isOpen={true}>
        <form method="post">
          <select onChange={updateCategory} name="category" id="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {data.categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {productList.length > 0 && (
            <select onChange={updateProduct} name="productId" id="productId" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {productList.map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          )}
          <br />
          <input
            type="text"
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Description text"
            name="description_text"
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)} // Update description text
            required
          />
          <br />
          {/* Conditional rendering of Description percentage input */}
          {descriptionText && (
            <input
              type="text"
              className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Description percentage"
              name="description_percentage"
              required
            />
          )}
          <button
            type="submit"
            className="left-12 top-3 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 "
            name="_action"
          onClick={() => navigate(`/done`)}

          >
            <span className=" relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-cyan-500 rounded-md group-hover:bg-opacity-0">
              Submit
            </span>
          </button>
        </form>
      </Modal>
    </>
  );
}
