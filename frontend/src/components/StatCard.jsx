function StatCard({

  title,
  value,
  color,

}) {

  return (

    <div className={`rounded-xl shadow-lg p-6 text-white ${color}`}>

      <h3 className="text-xl">

        {title}

      </h3>

      <p className="text-5xl font-bold mt-4">

        {value}

      </p>

    </div>

  );
}

export default StatCard;