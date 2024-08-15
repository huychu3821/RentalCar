import { useEffect, useState } from 'react';

export default function Details({ data, additionFunctions }) {
    const [addtions, setAdditions] = useState(additionFunctions);

    const isContain = (item) => {
        return data.additionFunctions.some((id) => item.id === id);
    };

    useEffect(() => {
        const dataMap = additionFunctions.map((item) => {
            return {
                id: item.id,
                name: item.name,
                symbol: item.symbol || '',
                isChecked: isContain(item),
            };
        });
        setAdditions(dataMap);
    }, [data, additionFunctions]);

    return (
        <>
            <div className="container-fuild mx-4">
                <h5 className="my-4">
                    Mileage: <span>{data.mileage}</span>
                </h5>
                <h5 className="my-4">
                    Fuel consumption: <span>{data.fuelConsumption}</span> liter/100km
                </h5>

                <h5>Address:</h5>
                <p>
                    {data.address + ', ' + data.ward + ', ' + data.district + ', ' + data.province}
                </p>

                <h5>Description:</h5>
                <p>{data.description}</p>

                <h5>Addition functions: </h5>

                <div className="container row">
                    {addtions.map((item) => {
                        return (
                            <div className="col-md-4 d-flex" key={item.id}>
                                {/* {item.symbol} */}
                                <p>{item.name}</p>
                                <input
                                    className=" mx-4 form-check-input"
                                    type="checkbox"
                                    defaultChecked={item.isChecked}
                                    disabled
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
