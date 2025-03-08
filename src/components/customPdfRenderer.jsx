import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const CustomPDFRenderer = ({ mainState }) => {
    const { currentDocument } = mainState;
    if (!currentDocument) return null;
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs`;

    return (
        <div id="my-pdf-renderer">
            <Document
                file={currentDocument.uri}
                onLoadError={(error) => console.error("Error loading document:", error)}
                onSourceError={(error) => console.error("Error with document source:", error)}
            >
                <Page pageNumber={1}/>
                <Page pageNumber={2}/>
            </Document>
        </div>
    );
};

CustomPDFRenderer.fileTypes = ["pdf", "application/pdf"];
CustomPDFRenderer.weight = 1;

export default CustomPDFRenderer;