'use client'
import { DropEvent, FileRejection, useDropzone } from "react-dropzone"
import React, { useMemo, useState } from "react"
import Image from "next/image"

const baseStyle = {
  display: 'block',
  justifyContent: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  width: '100vw',
  height: '100vh',
  margin: 0,
}

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

export function Dropzone(){

    const [images, setImages] = useState<{ url: string, x: number, y: number }[]>([]);
    const [panel, setPanel] = useState<{visible: boolean, x: number, y: number, i: number}>({
      visible: false,
      x: 0,
      y: 0,
      i: 0,
    })
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
    
    function deleteImage(){
       console.log(selectedImageIndex)
        console.log('a')
      if(selectedImageIndex == null)
        return
      
      setImages(
        [...images].filter((item, index) =>{
          return index != selectedImageIndex
        })
      )

      setPanel(
        {
          visible: false,
          x: 0,
          y: 0,
          i: 0
        }
      )

       
    }


    function renderPanel (x: number, y: number) {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: x,
      top: y,
      backgroundColor: 'gray',
      width: '100px',
      height: 'auto',
    }

    return (
      <div>
        <ul style={style}>
          <li onClick={()=>{deleteImage()}}
          style={{
            cursor: 'pointer',
            userSelect: 'none'
          }}
          >Delete</li>
        </ul>
      </div>
    )
  }

    const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {'image/*': []}, 
    noClick: true, 
    noKeyboard: true,
    maxFiles: 1,
    onError: onError,
});


function onDrop(acceptedFiles: File[], rejectedFiles: FileRejection[], e: DropEvent){
    if(isDragReject)
      console.log('rejected')
      else{
          acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.error('file reading was aborted')
      reader.onerror = () => console.error('file reading has failed')
      reader.onload = () => {
        const url = URL.createObjectURL(file)
        
          setImages(
           images=> [
              ...images,
              {
              "url": url as string,
              "x": e.clientX,
              "y": e.clientY
              }
            ]
          )
   }
      reader.readAsDataURL(file)
      console.log(e)
      
    })
      }
  }
function onError(e: Error){
  console.error(e)
}

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);



  return(
        <div className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>{images.length <= 0 ? 'Drag n drop some files here, or click to select files' : ''}</p>
          {images.map((image, index) => (
    <Image 
    src={image.url} 
    alt="" key={index} 
    width={100} 
    height={100}
    onClick={
      ()=>{

        console.log(index)
        setSelectedImageIndex(index)

        setPanel(
          {
            visible: !panel?.visible,
            x: image.x,
            y: image.y,
            i: index
          }
        )
      }
    }
    style={{
      position: 'absolute',
      left: image.x - 100/2,
      top: image.y - 100/2
    }}
    >

    </Image>
  ))}

  {
    (panel.visible && images.length > 0) ? renderPanel(panel.x, panel.y) : ''
  }
      </div>
       <div>

</div>

    </div>
  )


}