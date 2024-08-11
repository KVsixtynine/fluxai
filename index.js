import Replicate from "replicate";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
// import { type } from "os";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "flux.html"));
});
app.get("/hello", (req, res) => {
  res.send("Hello");
});
app.use(express.json()); // Parse JSON request bodies

app.post("/generate", async (req, res) => {
  if (req.body && req.body.prompt) {
    try {
      const { prompt, ratio, numsImg, typeImg, seedValue } = req.body;
      const imageUrl = await generateImage({
        prompt,
        ratio,
        numsImg,
        typeImg,
        seedValue,
      });
     
      res.json({ imageUrl }); // Corrected line
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Image generation failed" });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "Missing prompt in request body" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// setting for generated image
async function generateImage(params) {
  const { prompt, ratio, numsImg, typeImg, seedValue } = params;
  console.log(params);

  const input = {
    prompt: prompt,
    num_outputs: parseInt(numsImg),
    aspect_ratio: ratio,
    output_format: typeImg,
    output_quality: 90,
    disable_safety_checker: true,
  };

  const output = await replicate.run("black-forest-labs/flux-schnell", {
    input,
  });
  return output;
}

/*app.all('/images/*', (req, res) => {
  res.status(403).send({
    message: 'Forbidden'
  });
});*/
