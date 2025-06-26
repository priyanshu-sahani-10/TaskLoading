import { CheckCircle2 } from "lucide-react";

const features = [
  "Easy issue reporting",
  "Geo-tagged complaints",
  "Real-time status updates",
  "Administrator dashboard",
  "History and tracking",
];

const Testimonial=()=> {
  return (
    <section className="bg-gray-50 dark:bg-gray-950 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center space-y-10">
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Why Use TaskLoading?
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A powerful civic engagement platform to bridge the gap between citizens and local governments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-5 border dark:border-gray-800 rounded-lg shadow-sm dark:shadow-none hover:shadow-md transition"
            >
              <CheckCircle2 className="text-blue-600 dark:text-blue-400 mt-1" size={24} />
              <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;