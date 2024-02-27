import PdfParse from "pdf-parse";
import axios from "axios";

export const generateEmbeddingFromS3Doc = async (presignedUrl: string) => {
    const response = await axios.get(presignedUrl, { responseType: 'arraybuffer' });

    // Parse the PDF
    const {text} = await PdfParse(response.data);
    const dataStrip = (text).replace(/\s+/g, " ");
    console.log(dataStrip)
    const embedding = await generateEmbeddingFromText(dataStrip)
    // Log the text to the console
    return embedding
}

export const generateEmbeddingFromText= async (text: string): Promise<Array<unknown>>  => {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;
    const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
    );
    const output = await extractor(text, {
        pooling: "mean",
        normalize: true,
    });
    return Array.from(output.data)
}