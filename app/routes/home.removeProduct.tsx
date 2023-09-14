import { type LoaderFunction, json, type ActionFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Modal } from "~/components/modal";
import { db } from "~/utils/prisma.server";
import { deleteProduct } from "~/utils/removeProduct";

export const loader: LoaderFunction = async () => {
  const items = await db.product.findMany();
  const categories = await db.productCategory.findMany();

  return json({ items, categories });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const productId = form.get('productId');

  if (typeof productId === 'string') {
    await deleteProduct(productId);
  }
  return redirect('/home');
};

export default function RemoveProduct() {
  const data = useLoaderData();
  const [category, setCategory] = useState("");
  const [currentProduct, setProduct] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productId, setProductId] = useState(""); 

  const updateCategory = (e: any) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setProduct("");
    // Filter the product list based on the selected category
    const filteredProducts = data.items.filter((p: any) => p.category_id === selectedCategory);
    setProductList(filteredProducts);
  };

  useEffect(() => {
    if (categoryList.length === 0) {
      setCategoryList(data.categories);
    }
  }, [data.categories]);

  const updateProduct = (e: any) => {
    const selectedProductId = e.target.value;
    setProduct(selectedProductId);
    // Automatically fill in the product ID when a product is selected
    setProductId(selectedProductId);
    console.log("Selected product_id:", selectedProductId);
  };

  const isDeleteButtonVisible = productId !== "";

  console.log("Current category:", category);
  console.log("Current product:", currentProduct);

  return (
    <Modal isOpen={true}>
      <form method="post">
        <select onChange={updateCategory} name="category" id="category"
          className= " bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select category</option>
          {categoryList.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select onChange={updateProduct} name="productId" id="productId"
          className= " bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        
        >
          <option value="">Select product</option>
          {productList.map((product: any) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <div>
          {currentProduct && (
            <div>Are you sure you want to delete this product?</div>
          )}
        </div>
        <input
          type="text"
          placeholder="Provide the Product ID"
          className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        {isDeleteButtonVisible && (
          <button
          type="submit"
          name="_action"
          className="mt-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
              Delete
          </button>
        )}
      </form>
    </Modal>
  );
}
