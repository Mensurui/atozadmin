import { type LoaderFunction, json, type ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Modal } from "~/components/modal";
import { db } from "~/utils/prisma.server";
import { deleteProductDescription } from "~/utils/removeProductDescription";

export const loader: LoaderFunction = async () => {
  const items = await db.product.findMany();
  const categories = await db.productCategory.findMany();
  const descriptions = await db.productDescription.findMany();

  return json({ items, categories, descriptions });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const descriptionId = form.get('descriptionId');

  if (typeof descriptionId === 'string') {
    await deleteProductDescription(descriptionId);
  } else {
    console.log("There is no description");
  }

  return redirect('/home');
};

export default function RemoveDescription() {
  const data = useLoaderData();
  const [category, setCategory] = useState("");
  const [currentProduct, setProduct] = useState("");
  const [productList, setProductList] = useState([]);
  const [descriptionList, setDescriptionList] = useState([]);
  const [description, setDescription] = useState(""); // Keep track of the selected description

  const updateCategory = (e: any) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setProduct("");
    setDescription(""); // Reset the selected description when the category changes
  };

  useEffect(() => {
    if (data.items.length > 0) {
      // Filter the product list based on the selected category
      const filteredProducts = data.items.filter((p: any) => p.category_id === category);
      setProductList(filteredProducts);
    }
  }, [category, data.items]);

  useEffect(() => {
    if (descriptionList.length === 0) {
      setDescriptionList(
        data.descriptions.filter((d: any) => d.product_id === currentProduct)
      );
    } else {
      setDescriptionList(
        data.descriptions.filter((d: any) => d.product_id === currentProduct)
      );
    }
  }, [currentProduct]);

  const updateProduct = (e: any) => {
    const selectedProductId = e.target.value;
    setProduct(selectedProductId);
    setDescription(""); // Reset the selected description when a new product is selected
    console.log("Selected product_id:", selectedProductId);
  };

  const updateDescription = (e: any) => {
    const selectedDescriptionId = e.target.value;
    setDescription(selectedDescriptionId);
    console.log("Selected description_id:", selectedDescriptionId);
  };

  const isDeleteButtonVisible = description !== ""; // Check if a description is selected

  console.log("Current category:", category);
  console.log("Current product:", currentProduct);
  const navigate = useNavigate();
  return (
    <Modal isOpen={true}>
      <form method="post">
        <select onChange={updateCategory} name="category" id="category"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select category</option>
          {data.categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select onChange={updateProduct} name="product" id="product"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select product</option>
          {productList.map((product: any) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <div>
          <select onChange={updateDescription} name="description" id="description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select description</option>
            {descriptionList.map((description: any) => (
              <option key={description.id} value={description.id}>
                {description.description_text}, {description.description_percentage}
              </option>
            ))}
          </select>
        </div>
        {currentProduct && (
          <div>Selected Description ID: {description}</div>
        )}
        <input
          type="text"
          placeholder="Provide the Description ID"
          className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="descriptionId"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {isDeleteButtonVisible && (
          <button
            type="submit"
            name="_action"
            className="mt-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            onClick={()=>navigate(`/done`)}
          >
            Delete
          </button>
        )}
      </form>
    </Modal>
  );
}
