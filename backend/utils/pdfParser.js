import axios from "axios";
import pdf from "pdf-parse-fork";

/**  Extract text from PDF File
* @param { string } filePath - Path to PDF File
* @returns { Promise<{text: string, numPages: number}> } filePath - Path to PDF File
*/

export const extractTextFromPDF = async (filePath) => {
    try {
        // Fetch the PDF from Cloudinary as an arraybuffer
        const response = await axios.get(fileUrl, { 
            responseType: 'arraybuffer' 
        });

        // Convert the response data to a Node.js Buffer
        const dataBuffer = Buffer.from(response.data);
        
        // Extract text using the fork (it's a function, not a constructor)
        // Standard pdf-parse-fork syntax: pdf(buffer, options)
        const data = await pdf(dataBuffer);

        return {
            text: data.text,
            numPages: data.numpages, // It is .numpages (all lowercase) in this library
            info: data.info,
        };

    } catch (error) {
        console.error("PDF parsing error: ", error);
        throw new Error("Failed to extract text from PDF.");
    }
};