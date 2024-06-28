import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage, db } from "../firebase"; // Ensure db is your Firestore instance
import { collection, getDocs, query, where } from "firebase/firestore";

function Test() {
  const [imagesUrl, setImagesUrl] = useState([]);

  useEffect(() => {
    const fetchEnabledImages = async () => {
      const q = query(
        collection(db, "images"),
        where("status", "==", "enabled")
      );
      const querySnapshot = await getDocs(q);
      const enabledImageNames = querySnapshot.docs.map((doc) => doc.id);
      const storeRef = ref(storage, "gs://fir-explorer-9c40f.appspot.com");
      const result = await listAll(storeRef);
      const urls = await Promise.all(
        result.items
          .filter((item) => enabledImageNames.includes(item.name))
          .map((item) => getDownloadURL(item))
      );
      setImagesUrl(urls);
    };

    fetchEnabledImages();
  }, []);

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

