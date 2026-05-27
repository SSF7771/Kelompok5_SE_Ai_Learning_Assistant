import fs from "fs/promises";
import pdf from "pdf-parse-fork";

/**  Extract text from PDF File
* @param { string } filePath - Path to PDF File
* @returns { Promise<{text: string, numPages: number}> } filePath - Path to PDF File
*/

export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        
        //pdf-parse expects a Uint8Array, not a Buffer
        const parser = new pdf(new Uint8Array(dataBuffer));
        const data = await parser.getText();

        return {
            text: data.text,
            numPages: data.numPages,
            info: data.info,
        };

    } catch (error) {
        console.error("PDF parsing error: ", error);
        throw new Error("Failed to extract text from PDF.");
    }
};