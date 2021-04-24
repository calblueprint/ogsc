// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Upload() {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/admin/users/addImage?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    console.log("form data:", formData);

    // const upload = await fetch(url);
    // const upload = await fetch(url, {
    //   method: "POST",
    // });

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    console.log(upload);

    if (upload.ok) {
      console.log("Uploaded successfully!");
    } else {
      console.error("Upload failed.");
    }
  };

  return (
    <>
      <p>Upload a .png or .jpg image (max 1MB).</p>
      <input
        onChange={uploadPhoto}
        type="file"
        accept="image/png, image/jpeg"
      />
    </>
  );
}

// const Test: React.FC = () => {
//   const uploadPhoto = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ): Promise<void> => {
//     const file = e.target.files[0];
//     const filename = encodeURIComponent(file.name);
//     const res = await fetch(`/api/upload-url?file=${filename}`);
//     const { url, fields } = await res.json();
//     const formData = new FormData();

//     Object.entries({ ...fields, file }).forEach(([key, value]) => {
//       formData.append(key, value);
//     });

//     const upload = await fetch(url, {
//       method: "POST",
//       body: formData,
//     });

//     if (upload.ok) {
//       console.log("Uploaded successfully!");
//     } else {
//       console.error("Upload failed.");
//     }
//   };

//   return (
//     <>
//       <p>Upload a .png or .jpg image (max 1MB).</p>
//       <input
//         onChange={uploadPhoto}
//         type="file"
//         accept="image/png, image/jpeg"
//       />
//     </>
//   );
// };

// export default Test;
