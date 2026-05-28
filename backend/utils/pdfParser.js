import axios from "axios";
import pdf from "pdf-parse-fork";

/**  Extract text from PDF File
* @param { string } filePath - Path to PDF File
* @returns { Promise<{text: string, numPages: number}> } filePath - Path to PDF File
*/

export const extractTextFromPDF = async (fileBuffer) => {
    try {
        const data = await pdf(fileBuffer); 

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