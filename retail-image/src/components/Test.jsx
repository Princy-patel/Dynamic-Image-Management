import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage, db } from "../firebase"; // Ensure db is your Firestore instance
import { collection, getDocs, query, where } from "firebase/firestore";

function Test() {
  const [imagesUrl, setImagesUrl] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnabledImages = async () => {
      // in collection, first agr - database object, second arg - collection we want to reference to
      const q = query(
        collection(db, "images"),
        where("status", "==", "enabled")
      );

      // try to retrieve all the document from the collection that matches with query
      const querySnapshot = await getDocs(q);

      // docs represent the all the document and get the id
      const enabledImageNames = querySnapshot.docs.map((doc) => {
        return doc.id;
      });
      const storeRef = ref(storage, "gs://fir-explorer-9c40f.appspot.com");
      const result = await listAll(storeRef);
      const urls = await Promise.all(
        result.items
          .filter((item) => enabledImageNames.includes(item.name))
          .map((item) => getDownloadURL(item))
      );
      setImagesUrl(urls);
      setLoading(false);
    };

    fetchEnabledImages();
  }, []);

  if (loading) {
    return (
      <h4 style={{ color: "lightcoral" }}>Loading... Patience, Please!</h4>
    );
  }

  return (
    <div>
      {imagesUrl.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`firebase-image-${index}`}
          width={300}
          height={300}
        />
      ))}
    </div>
  );
}

export default Test;
