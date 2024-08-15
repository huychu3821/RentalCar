import { useEffect, useState } from 'react';

export default function TermOfUses({ data, termOfUses }) {
    const [terms, setTerms] = useState([]);

    const isContain = (item) => {
        return data.TermOfUses.some((id) => item.id === id);
    };

    useEffect(() => {
        const termItems = termOfUses.map((item) => {
            return {
                id: item.id,
                name: item.name,
                symbol: item.symbol || '',
                checked: isContain(item),
            };
        });
        setTerms(termItems);
    }, [data, termOfUses]);

    return (
        <>
            <div className="container-fluid mx-5">
                <div className="col-md-6 row">
                    <div className="col-md-6">
                        <p className="my-4 fw-bold">Mileage</p>
                    </div>
                    <div className="col-md-6 d-flex">
                        <input
                            type="text"
                            defaultValue={data.mileage}
                            className=" my-4 w-25 h-25"
                            disabled
                        />
                        <p className="fw-bold mx-4 my-4">VND/Day</p>
                    </div>
                </div>

                <div className="col-md-6 row">
                    <div className="col-md-6">
                        <p className="my-4 fw-bold">Required deposit</p>
                    </div>
                    <div className="col-md-6 d-flex">
                        <input
                            type="text"
                            defaultValue={data.deposit}
                            className=" my-4 w-25 h-25"
                            disabled
                        />
                        <p className="fw-bold mx-4 my-4">VND</p>
                    </div>
                </div>

                <div className="col-md-6 row">
                    <p className="my-4 fw-bold">Term of use</p>
                </div>

                <div className="container row col-md-6">
                    {terms.map((item) => {
                        return (
                            <div className="col-md-6 d-flex" key={item.id}>
                                <i className={item.symbol}></i>
                                <p>{item.name}</p>
                                <input
                                    className=" mx-2 form-check-input"
                                    type="checkbox"
                                    defaultChecked={item.checked}
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
