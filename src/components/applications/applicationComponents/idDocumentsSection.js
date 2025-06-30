import React, { useState } from "react";

export function IdDocumentsSection({ title, documents }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPdf = (url) => url.toLowerCase().endsWith(".pdf");
  const isImage = (url) => /\.(jpe?g|png|webp|gif)$/i.test(url);

  const handlePreview = (url) => {
    if (url && (isPdf(url) || isImage(url))) {
      setIsLoading(true);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{title}</h5>
        {/* <button className="btn btn-outline-secondary btn-sm">View Documents</button> */}
      </div>

      <div className="row g-3">
        {documents.map((doc, index) => {
          const hasValidFile = doc.url && (isPdf(doc.url) || isImage(doc.url));
          return (
            <div key={index} className="col-sm-6 col-md-3">
              <div
                className="border rounded text-center p-3 h-100 cursor-pointer"
                style={{ cursor: hasValidFile ? "pointer" : "default" }}
                onClick={() => handlePreview(doc.url)}
              >
                {hasValidFile ? (
                  isPdf(doc.url) ? (
                    <iframe
                      src={doc.url}
                      onLoad={() => setIsLoading(false)}
                      className="w-100"
                      style={{ height: "130px", borderRadius: "6px" }}
                    />
                  ) : (
                    <img
                      src={doc.url}
                      alt={doc.label}
                      onLoad={() => setIsLoading(false)}
                      className="img-fluid mb-2 rounded"
                      style={{ height: "110px", objectFit: "cover" }}
                    />
                  )
                ) : (
                  <div className="bg-light text-muted d-flex align-items-center justify-content-center mb-2" style={{ height: "110px", borderRadius: "6px" }}>
                    No Preview
                  </div>
                )}
                <p className="mb-1 fw-medium">{doc.label}</p>
                <small className="text-muted">
                  {hasValidFile ? "Click to view" : "No File Available"}
                </small>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <h5 className="modal-title">Document Preview</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPreviewUrl(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                {isLoading && <p className="text-white">Loading...</p>}
                {isPdf(previewUrl) ? (
                  <iframe
                    src={previewUrl}
                    className="w-100"
                    style={{ height: "80vh", border: "none" }}
                    onLoad={() => setIsLoading(false)}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="img-fluid"
                    style={{ maxHeight: "80vh" }}
                    onLoad={() => setIsLoading(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
