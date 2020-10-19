const upload=document.getElementById("imageprev")
const verify=document.getElementById("verify")

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start())

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
async function start() {
    verify.addEventListener("click",async ()=>{
        const image = await faceapi.bufferToImage(dataURLtoFile(upload.src,"img"))
        // console.log(image)
        console.log("got something!!!")
        const detections =await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
        console.log(detections)
        data={
          "encodings":detections.descriptor
        }
        fetch('http://localhost:5000/image', {
             method: 'POST',
             headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
             // header need for json data , otherwise error 
         }).then(response => response.json())
         .then(data => alert("Hello Roll No : "+data['message']))
         
        //  var res=(await response).json();
        //  console.log(res)
         
        })
      }