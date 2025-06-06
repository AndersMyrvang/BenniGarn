import { app } from "../config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(app);
// bruk `db` her


// Function to add data to a Firestore collection
export default async function addData(
  collection: string,
  id: string,
  data: any
) {
  // Variable to store the result of the operation
  let result = null;
  // Variable to store any error that occurs during the operation
  let error = null;

  try {
    // Set the document with the provided data in the specified collection and ID
    result = await setDoc(doc(db, collection, id), data, {
      merge: true, // Merge the new data with existing document data
    });
  } catch (e) {
    // Catch and store any error that occurs during the operation
    error = e;
  }

  // Return the result and error as an object
  return { result, error };
}
