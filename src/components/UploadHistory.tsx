const UploadHistory = () => {
  const mockData = [
    {
      fileName: "data.json",
      date: "16/08/2025, 16:24:24",
      by: "khan",
      inserted: 51,
      skipped: 0,
    },
    {
      fileName: "greetingdata.json",
      date: "16/08/2025, 16:24:11",
      by: "khan",
      inserted: 8,
      skipped: 0,
    },
  ];

  return (
    <div className="border p-4 rounded-lg">
      <div className="space-y-3">
        {mockData.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <p className="font-medium text-blue-600">{item.fileName}</p>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>
            <div className="text-sm text-gray-700 text-right">
              <p>
                <span className="font-semibold">By:</span> {item.by}
              </p>
              <p>
                <span className="font-semibold">Inserted:</span> {item.inserted}
                , <span className="font-semibold">Skipped:</span> {item.skipped}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadHistory;
