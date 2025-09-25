import { FaMapMarkerAlt } from "react-icons/fa";



    return (
        <div className="relative pl-6 space-y-6 mt-10 mb-10">
            {
                events.map((event, index) => (
                    <div key={index} className="relative group bg-color-75 rounded-lg shadow-md p-4">
                        <div className="absolute -left-3 w-6 h-6 bg-accent-two rounded-full flex items-center justify-center text-white shadow-lg">
                            <FaMapMarkerAlt size={14} />
                        </div>
                        <h3 className="text-lg font-semibold">
                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="hover:underline title">
                                {event.title}
                            </a>
                        </h3>
                        <p className="mt-1">{event.description}</p>
                        <div className="flex flex-cols list-none justify-start align-center gap-4">
                            {event.images?.map((image, index) => (
                                <div key={index} className="mt-2 flex-1">
                                    <img src={image} alt={`Image ${index + 1} for ${event.title}`} className="mt-2 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
        </div>
    );
};
export default Timeline;