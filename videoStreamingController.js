const express = require('express') ;
const fs = require('fs') ;

const handleVideoStreaming = async(req,res) => {
 
 if(!req.headers.range){
    return res.status(400).send({message:'The range should me necessarily specified'}) ;
 }   
 const range = req.headers.range ;
 const videoPath = './video.mp4';
 let videoSize;
try {
  videoSize = fs.statSync(videoPath).size;
} catch (err) {
  console.log('Video file not found, creating it now...');
  const videoStream = fs.createWriteStream(videoPath);
  videoStream.write('dummy data');
  videoStream.end();
  videoSize = fs.statSync(videoPath).size;
}
const chunkSize = 1 * 1e6;
const start = Number(range.replace(/\D/g, ''));
const end = Math.min(start + chunkSize, videoSize - 1);
const contentLength = end - start + 1;
const headers = {
  'Content-Range': `bytes ${start}-${end}/${videoSize}`,
  'Accept-Ranges': 'bytes',
  'Content-Length': contentLength,
  'Content-Type': 'video/mp4',
};
res.writeHead(206, headers);
const stream = fs.createReadStream(videoPath, {
  start,
  end,
});
stream.pipe(res);
}

const videoStreamingRouter = express.Router() ;
videoStreamingRouter.get('/getVideoStream',handleVideoStreaming) ;

module.exports = videoStreamingRouter ;
