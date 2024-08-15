'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAppContext } from '@/app/app-provider';
import { Button } from 'react-bootstrap';
import { formattedNumber } from '@/lib/format-number';

export default function EWalletPage() {
    const { sessionToken } = useAppContext();
    const [topUpLoading, setTopUpLoading] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    const [wallet, setWallet] = useState({
        id: '',
        balance: 0,
        accountId: '',
    });

    const [transactionList, setTransactionList] = useState({
        fromDate: '',
        toDate: '',
        page: 0,
        size: 0,
        totalPage: 0,
        transactionHistoryResponses: [],
    });

    const [transactionRequest, setTransactionRequest] = useState({
        toDate: new Date().toISOString().split('T')[0],
        fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString()
            .split('T')[0],
        page: 0,
        size: 10,
    });

    const [changeTopupRequest, setChangeTopupRequest] = useState({
        changeAmount: '',
        changeType: '',
        transactionType: '',
        accountId: '',
    });

    const [changeWithdrawRequest, setchangeWithdrawRequest] = useState({
        changeAmount: '',
        changeType: '',
        transactionType: '',
        accountId: '',
    });

    const [fromDate, setFromDate] = useState(
        new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    );
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

    const [withDrawShow, setWithDrawShow] = useState(false);
    const [topUpShow, setTopUpShow] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const walletResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/wallet/get`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );

                if (!walletResponse.ok) {
                    throw new Error('Failed to fetch wallet data');
                }

                const walletJson = await walletResponse.json();

                if (walletJson.isSuccess) {
                    const response = walletJson.body;
                    setWallet({
                        id: response.id || '',
                        balance: response.balance || 0,
                        accountId: response.accountId || '',
                    });

                    setChangeTopupRequest({
                        changeAmount: 2000000,
                        changeType: 'INCREASE',
                        transactionType: 'TOP_UP',
                        accountId: response.accountId,
                    });

                    setchangeWithdrawRequest({
                        changeAmount: 2000000,
                        changeType: 'DECREASE',
                        transactionType: 'WITHDRAWAL',
                        accountId: response.accountId,
                    });
                }

                const transactioListResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/wallet/get-transaction`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                        body: JSON.stringify(transactionRequest),
                        method: 'POST',
                    },
                );

                if (!transactioListResponse.ok) {
                    throw new Error('Failed to fetch transaction data');
                }

                const transactionListJson = await transactioListResponse.json();

                if (transactionListJson.isSuccess) {
                    const response = transactionListJson.body;
                    setTransactionList({
                        fromDate: response.fromDate || transactionRequest.fromDate,
                        toDate: response.toDate || transactionRequest.toDate,
                        page: response.page || 0,
                        size: response.size || 10,
                        totalPage: response.totalPage || 0,
                        transactionHistoryResponses:
                            response.transactionHistoryResponses.map((item) => ({
                                transactionId: item.transactionId || '',
                                changeAmount: item.changeAmount || '',
                                changeType: item.changeType || '',
                                transactionType: item.transactionType || [],
                                transactionDate: item.transactionDate || '',
                                bookingId: item.bookingId || 'N/A',
                                carName: item.carName || 'N/A',
                            })) || [],
                    });

                    setFromDate(response.fromDate);
                    setToDate(response.toDate);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [transactionRequest, sessionToken]);

    const onChangePage = (index) => {
        setTransactionRequest((prevState) => ({
            ...prevState,
            page: index,
        }));
    };

    const onChangeSize = (event) => {
        setTransactionRequest((prevState) => ({
            ...prevState,
            size: parseInt(event.target.value, 10),
            page: 0,
        }));
    };

    //todo:
    const onSunmitTopup = async () => {
        setTopUpLoading(true);
        await handleSubmit(changeTopupRequest);

        setTopUpShow(false);
    };

    const onSubmitWithdraw = async () => {
        if (changeWithdrawRequest.changeAmount > wallet.balance) {
            await alert('The amount you want to withdraw is higher than balance.');
            return;
        }
        setWithdrawLoading(true);

        await handleSubmit(changeWithdrawRequest);
        setWithDrawShow(false);
    };

    const handleSubmit = async (formRequest) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/wallet/save-transaction`,
                {
                    // mode: 'no-cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify(formRequest),
                },
            );

            if (response.ok) {
                alert('Transaction saved successfully');
                window.location.reload();
            } else {
                alert('An error occurred during update profile');
            }
        } catch (error) {
            alert('Can not update.');
        }
    };

    const handleChangeAmountTopUpRequest = (event) => {
        setChangeTopupRequest((prev) => ({
            ...prev,
            changeAmount: event.target.value,
            accountId: wallet.accountId,
        }));
    };

    const handleChangeAmountWithdrawRequest = (event) => {
        setchangeWithdrawRequest((prev) => ({
            ...prev,
            changeAmount: event.target.value,
            accountId: wallet.accountId,
        }));
    };

    const handleOnClickSearch = () => {
        if (fromDate > toDate) {
            alert('From date should be less than or equal to To date');
            return;
        }
        setTransactionRequest((prevState) => ({
            ...prevState,
            fromDate: fromDate,
            toDate: toDate,
        }));
    };

    return (
        <>
            <div className="container-fuild m-3">
                <div className="mb-3">
                    <span className="">
                        <Link href={'/'}>Home</Link>
                        <i className="bi bi-chevron-right"></i>
                        <Link href={'#'}> My wallet</Link>
                    </span>
                </div>
                <div className="container-fluid row">
                    <h3 className="fw-bold">My Wallet</h3>

                    <div className="col-md-6 my-3">
                        <p className="fw-bold">Your current balance:</p>
                        <h2 className="mx-3 text-success">{formattedNumber(wallet.balance)} VND</h2>
                    </div>

                    <div className="col-md-6 my-3 d-flex">
                        <Button
                            className="btn-warning h-50 w-25 mx-2"
                            onClick={() => setWithDrawShow(true)}
                        >
                            Withdraw
                        </Button>
                        <Button
                            className="btn-success h-50 w-25"
                            onClick={() => setTopUpShow(true)}
                        >
                            Top-up
                        </Button>
                    </div>

                    <div>
                        <p className="fw-bold">Transaction:</p>

                        <div className="d-flex mx-3 my-3 justify-content-between">
                            <div className="d-flex">
                                <p className="fw-bold">From</p>
                                <input
                                    type="date"
                                    className="form-control h-75 mx-5"
                                    id="from-input"
                                    defaultValue={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            <div className="d-flex mx-5">
                                <p className="fw-bold">To</p>
                                <input
                                    type="date"
                                    className="form-control h-75 mx-5"
                                    id="to-input"
                                    defaultValue={toDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="d-flex">
                            <input
                                type="submit"
                                className="ms-auto btn btn-primary"
                                value={'Search'}
                                style={{ width: '125px' }}
                                onClick={handleOnClickSearch}
                            />
                        </div>
                    </div>
                    <table className="table table-striped table-bordered my-5">
                        <thead className="table-secondary">
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Type</th>
                                <th scope="col">Date time</th>
                                <th scope="col">Booking No.</th>
                                <th scope="col">Car Name</th>
                                <th scope="col">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionList.transactionHistoryResponses.map((item) => {
                                return (
                                    <tr key={item.transactionId}>
                                        <th scope="row">{item.transactionId}</th>
                                        <td>
                                            {item.changeType === 'INCREASE'
                                                ? '+ ' + formattedNumber(item.changeAmount)
                                                : '- ' + formattedNumber(item.changeAmount)}
                                        </td>
                                        <td>{item.transactionType.etransactionType}</td>
                                        <td>
                                            {item.transactionDate.split('T')[0] +
                                                ' ' +
                                                item.transactionDate.split('T')[1].split('.')[0]}
                                        </td>
                                        <td>{item.bookingId}</td>
                                        <td>{item.carName}</td>
                                        <td></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-end">
                        <div className="mx-3">
                            <select
                                id="size-selector"
                                className="form-select w-auto"
                                value={transactionRequest.size}
                                onChange={onChangeSize}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                <li className="page-item">
                                    <a
                                        className="page-link"
                                        href="#"
                                        aria-label="Previous"
                                        onClick={() => onChangePage(transactionRequest.page - 1)}
                                        disabled={transactionRequest.page === 0}
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>

                                {Array.from({ length: transactionList.totalPage }, (_, index) => (
                                    <li className="page-item" key={index}>
                                        <button
                                            className="page-link"
                                            onClick={() => onChangePage(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className="page-item">
                                    <a
                                        className="page-link"
                                        href="#"
                                        aria-label="Next"
                                        onClick={() => onChangePage(transactionRequest.page + 1)}
                                        disabled={
                                            transactionRequest.page >= transactionList.totalPage - 1
                                        }
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <Modal
                show={withDrawShow}
                onHide={() => setWithDrawShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">Withdraw</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">
                        Your current balance is ${wallet.balance}. Please select the amount to
                        withdraw from your wallet
                    </p>

                    <div className=" d-flex justify-content-center">
                        <select
                            id="size-selector"
                            className="form-select w-auto"
                            value={changeWithdrawRequest.changeAmount || 0}
                            onChange={handleChangeAmountWithdrawRequest}
                        >
                            <option value={2000000}>2,000,000</option>
                            <option value={5000000}>5,000,000</option>
                            <option value={10000000}>10,000,000</option>
                            <option value={wallet.balance}>All balance</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-secondary  w-25"
                        onClick={() => setWithDrawShow(false)}
                        disabled={withdrawLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary w-25"
                        onClick={() => {
                            onSubmitWithdraw();
                        }}
                        disabled={withdrawLoading}
                    >
                        {withdrawLoading ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : null}
                        OK
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={topUpShow}
                onHide={() => setTopUpShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">Top-up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">
                        Your current balance is ${wallet.balance}. Please select the amount to
                        Top-up from your wallet
                    </p>

                    <div className=" d-flex justify-content-center">
                        <select
                            id="size-selector"
                            value={changeTopupRequest.changeAmount || 0}
                            onChange={handleChangeAmountTopUpRequest}
                            className="form-select w-auto"
                        >
                            <option value={2000000}>2,000,000</option>
                            <option value={5000000}>5,000,000</option>
                            <option value={10000000}>10,000,000</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-secondary  w-25"
                        onClick={() => setTopUpShow(false)}
                        disabled={topUpLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary w-25"
                        onClick={() => {
                            onSunmitTopup();
                        }}
                        disabled={topUpLoading}
                    >
                        {topUpLoading ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : null}
                        OK
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
