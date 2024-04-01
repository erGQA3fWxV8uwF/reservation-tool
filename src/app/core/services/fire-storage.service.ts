import { Injectable } from "@angular/core";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
@Injectable({
  providedIn: "root",
})
export class FireStorageService {
  constructor() {}

  uploadFileToCloud(
    file: File,
    roomName: string,
    type: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      let storageRef;
      const metadata = {
        contentType: "image/jpeg",
      };
      if (type == "map") {
        storageRef = ref(storage, "maps/" + roomName + "_mapImage");
      } else {
        storageRef = ref(storage, "previews/" + roomName + "_previewImage");
      }
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("File available at", downloadURL);
              resolve(downloadURL);
            })
            .catch(reject);
        }
      );
    });
  }

  deleteFile(roomName: string): Promise<void> {
    const storage = getStorage();

    const deleteRefPreview = ref(
      storage,
      "previews/" + roomName + "_previewImage"
    );
    const deleteRefMap = ref(storage, "maps/" + roomName + "_mapImage");

    return Promise.all([
      deleteObject(deleteRefPreview),
      deleteObject(deleteRefMap),
    ]).then(() => {});
  }
}
