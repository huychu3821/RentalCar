import { useAppContext } from '@/app/app-provider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TermOfUses({ data, termOfUses, carId }) {
    const { sessionToken } = useAppContext();
    const router = useRouter();

    const [formData, setFormData] = useState({});
    const [terms, setTerms] = useState(termOfUses);

    const isContain = (item) => {
        return data.TermOfUses.some((id) => item.id === id);
    };

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            price: data.basePrice,
            deposit: data.deposit,
            additionRules: termOfUses
                .filter((item) => data.TermOfUses.includes(item.id))
                .map((item) => item.id),
        }));

        const termItems = termOfUses.map((item) => {
            return {
                id: item.id,
                name: item.name,
                symbol: item.symbol || '',
                isChecked: isContain(item),
            };
        });
        setTerms(termItems);
    }, [data, termOfUses]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnCheckBoxChange = (e) => {
        const { id, checked } = e.target;
        const ruleValue = parseInt(id);

        setFormData((prevFormData) => ({
            ...prevFormData,
            additionRules: checked
                ? [...prevFormData.additionRules, ruleValue]
                : prevFormData.additionRules.filter((rule) => rule !== ruleValue),
        }));

        setTerms((prevTerms) =>
            prevTerms.map((item) =>
                item.id === ruleValue ? { ...item, isChecked: checked } : item,
            ),
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.price <= 0 || formData.deposit <= 0) {
            return;
        }
        const jsonData = {};
        Object.keys(formData).forEach((key) => {
            jsonData[key] = formData[key];
        });

        const form = new FormData();
        form.append('data', JSON.stringify(jsonData));

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/edit-car-information/${carId}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: form,
                },
            );

            if (!response.ok) {
                alert('Edit car fail!');
                return;
            }

            await alert('Edit car successfully!');
            router.refresh();
        } catch (e) {
            console.log('Error', e);
        }
    };

    return (
        <>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="container-fluid mx-5">
                    <div className="col-md-8 d-flex my-3">
                        <label className="col-md-4 fw-bold mb-2">Base price:</label>
                        <br />
                        <input
                            type="text"
                            name="price"
                            value={formData.price || ''}
                            onChange={handleOnChange}
                            className="col-md-3 border border-dark"
                            required
                            disabled={data.carStatus == 'BOOKED'}
                        />
                        <span className="fw-bold ms-1">VND/Day</span>
                        {formData.price <= 0 && (
                            <span className="text-danger">Base price must be greater than 0</span>
                        )}
                    </div>

                    <div className="col-md-8 d-flex my-3">
                        <label className="col-md-4 fw-bold mb-2">Required deposit:</label>
                        <br />
                        <input
                            type="text"
                            name="deposit"
                            value={formData.deposit || ''}
                            onChange={handleOnChange}
                            className="col-md-3 border border-dark"
                            disabled={data.carStatus == 'BOOKED'}
                        />
                        <span className="fw-bold ms-1">VND</span>
                        {formData.deposit <= 0 && (
                            <span className="text-danger">Deposit must be greater than 0</span>
                        )}
                    </div>

                    <div className="col-md-6 row">
                        <p className="my-4 fw-bold">Term of use</p>
                    </div>

                    <div className="container row col-md-6">
                        {terms.map((item) => (
                            <div key={item.id} className="col-6 mb-2">
                                <input
                                    type="checkbox"
                                    id={item.id.toString()}
                                    name={item.name}
                                    checked={item.isChecked}
                                    onChange={handleOnCheckBoxChange}
                                    disabled={data.carStatus == 'BOOKED'}
                                />
                                <label className="form-check-label" htmlFor={item.id}>
                                    {item.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="d-flex justify-content-center mt-5">
                    <Link href={`/owner/cars`} className="mt-2 mx-5 text-dark">
                        Discard
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </div>
            </form>
        </>
    );
}
