export default function EditCarBasicInfo({ data }) {
    return (
        <>
            <div className="container row">
                <div className="col-md-5">
                    <table className="table my-3">
                        <tbody>
                            <tr className="my-2">
                                <td className="col-md-8 fw-bold">License plate:</td>
                                <td className="col-md-4">{data.licensePlate}</td>
                            </tr>
                            <tr className="my-2">
                                <td className="col-md-8 fw-bold">Brand name:</td>
                                <td className="col-md-4">{data.brand}</td>
                            </tr>
                            <tr className="my-2">
                                <td className="col-md-8 fw-bold">Production year:</td>
                                <td className="col-md-4">{data.productionYear}</td>
                            </tr>
                            <tr className="my-2">
                                <td className="col-md-8 fw-bold">Transmission:</td>
                                <td className="col-md-4">{data.transmissionType}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="col-md-5">
                    <table className="table my-3">
                        <tbody>
                            <tr className="my-2">
                                <td className="col-md-8 fw-bold">Color:</td>
                                <td className="col-md-4">{data.color}</td>
                            </tr>
                            <tr className="my-2">
                                <td className="col-md-8 fw-bold">Model:</td>
                                <td className="col-md-4">{data.model}</td>
                            </tr>
                            <tr className="my-2">
                                <td className="col-md-8 fw-bold">No. of seats:</td>
                                <td className="col-md-4">{data.numberOfSeats}</td>
                            </tr>
                            <tr className="my-2">
                                <td className="col-md-8 fw-bold">Fuel:</td>
                                <td className="col-md-4">{data.fuelType}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="container">
                <p className="fw-bold">Docutments:</p>
                <div className="col-md-6">
                    <table className="table table-striped table-bordered my-3">
                        <thead className="table-secondary">
                            <tr>
                                <th className="col-md-1">No</th>
                                <th className="col-md-5">Name</th>
                                <th className="col-md-3">Note</th>
                                <th className="col-md-3">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Registration paper</td>
                                <td>{data.document.registration ? 'Verified' : 'Not available'}</td>
                                <td>{data.document.registration ? 'Link' : 'Not available'}</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Certification of Inspection</td>
                                <td>{data.document.certificate ? 'Verified' : 'Not available'}</td>
                                <td>{data.document.certificate ? 'Link' : 'Not available'}</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Insurance</td>
                                <td>{data.document.insurance ? 'Verified' : 'Not available'}</td>
                                <td>{data.document.insurance ? 'Link' : 'Not available'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
