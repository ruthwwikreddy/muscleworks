import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const images = [
  "/images/Gym (1).png",
  "/images/Gym (3).png",
  "/images/Gym (4).png",
  "/images/Gym (7).png",
  "/images/Gym (8).png",
];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-20 bg-black" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Our Gallery</h2>
          <div className="relative">
            <h3 className="text-4xl font-bold text-white mb-8">
              Glimpses of Our Fitness Haven
            </h3>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-muscle-red"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl bg-black border-none">
            <img
              src={selectedImage || ""}
              alt="Selected gallery image"
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
