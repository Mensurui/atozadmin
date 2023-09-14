import {  redirect, type ActionFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {  useState } from "react";
import { Modal } from "~/components/modal";
import { SelectBox } from "~/components/select-box";
import {  deleteProductCategory, getAllCategoryAndID } from "~/utils/removeCategory.server";

export const loader: LoaderFunction = async () => {
  const items = await getAllCategoryAndID();

  console.log("Here is the list of items:", items);

  // Create arrays to store names and ids
  const names: any = [];
  const ids: any = [];

  // Iterate through the items and extract name and id
  items.forEach((item) => {
    const { name, id } = item;
    names.push(name);
    ids.push(id);
  });

  // Now you can return the arrays of names and ids
  return { names, ids };
};

export const action : ActionFunction = async({request}) => {
    const form = await request.formData();
    const categoryId = form.get('categoryId');

    if(typeof categoryId === 'string') {
        await deleteProductCategory(categoryId);
    }
    return redirect('/home')
}

export default function RemoveCategory() {
  const data = useLoaderData();
  const listOfCategoryNames = data.names;
  const listOfCategoryIDs = data.ids;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const handleSelection = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
  
    const selectedIndex = listOfCategoryNames.indexOf(selectedValue);
  
    if (selectedIndex !== -1) {
      setSelectedId(listOfCategoryIDs[selectedIndex]);
    } else {
      setSelectedId("");
    }
  
    setSelectedCategory(selectedValue);
    console.log("This right here is selected id", selectedId);
  };

  const navigate = useNavigate();

  return (
      <Modal isOpen={true}>
      <SelectBox
        options={listOfCategoryNames}
        value={selectedCategory}
        onChange={handleSelection}
        className= " bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

      />
       { selectedCategory ?  <form method="post">
            {/* <h3>Here is the categories ID: {selectedId}</h3> */}
            <h1>Are you sure you want to delete this category?</h1>
            <input 
            type="text" 
            // className="flex flex-col mb-3"
            placeholder="Rewrite the Category Id"
            name="categoryId"
            value={selectedId}
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
        <button
        type="submit"
        name="_action"
        className="mt-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
        onClick={() => navigate(`/done`)}
        >
            Delete
        </button>
      </form> : ""}
    </Modal>
  );
}
