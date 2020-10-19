upload=document.getElementById("faceID")
submit=document.getElementById("uploadImage")
console.log(Roll)

    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        ]).then(start())      
      async function start() 
  {
      const container = document.createElement('div')
      container.style.position='relative'
      document.body.append(container)
      submit.addEventListener('click', async()=>{

          console.log("ok moving")
          const image = await faceapi.bufferToImage(upload.files[0])
          const detections =await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
          console.log(detections)
          console.log(detections.detection)
          data={
            "encodings":detections.descriptor,
            "rollNo" :Roll
            
          }
          console.log("reached ")
            console.log("do something ...")
            fetch('http://localhost:5000/encodings', {
                method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify(data),
            })  
            window.location.href = "http://localhost:5000/register";
          })

          
  }