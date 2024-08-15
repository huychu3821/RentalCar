import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/app/app-provider';
import AfterBookingDetails from './after-booking-detail';
import fetchImageURL from '@/lib/fetchImage';
import BasicInformation from '../cars/basic-information';
import Details from '../cars/detail';
import TermOfUses from '../cars/term-of-use';
import CarInformationTab from './information-tab';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function BookingForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Booking Information');
    const [imageRequest, setImageRequest] = useState({});
    const [imageRequestDriver, setImageRequestDriver] = useState({});
    const [imageDisplay, setImageDisplay] = useState({});
    const [imageDisplayDriver, setImageDisplayDriver] = useState({});
    const [wallet, setWallet] = useState();
    const [numberOfDays, setNumberOfDays] = useState(0);

    const [data, setData] = useState({
        id: '',
        licensePlate: '',
        color: '',
        numberOfSeats: '',
        productionYear: '',
        transmissionType: '',
        fuelType: '',
        fuelConsumption: '',
        mileage: '',
        basePrice: '',
        deposit: '',
        description: '',
        frontImage: '',
        backImage: '',
        leftImage: '',
        rightImage: '',
        address: '', //todo: add ward, district, province
        ward: '',
        district: '',
        province: '',
        carStatus: '',
        model: '',
        brand: '',
        document: [],
        additionFunctions: [],
        TermOfUses: [],
        rate: '',
    });

    const [image, setImage] = useState([]);

    const [additionFunctionList, setAdditionFunctionList] = useState([]);
    const [termOfUses, setTermOfUses] = useState([]);
    const params = useParams();
    const bookingId = params.slug;
    const { sessionToken } = useAppContext();
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrlDriver, setImageUrlDriver] = useState('');
    const [error, setError] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedProvinceDriver, setSelectedProvinceDriver] = useState('');
    const [selectedDistrictDriver, setSelectedDistrictDriver] = useState('');
    const [selectedWardDriver, setSelectedWardDriver] = useState('');
    const [formData, setFormData] = useState({
        carId: '',
        totalAmount: '',
        deposit: '',
        status: '',
        basePrice: '',
        startDate: '',
        endDate: '',
        name: '',
        phone: '',
        dob: '',
        nationalId: '',
        detailAddress: '',
        ward: '',
        district: '',
        city: '',
        license: '',
        email: '',
        nameDriver: '',
        phoneDriver: '',
        dobDriver: '',
        nationalIdDriver: '',
        detailAddressDriver: '',
        wardDriver: '',
        districtDriver: '',
        cityDriver: '',
        driverLicense: '',
        emailDriver: '',
        paymentMethod: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/${bookingId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                        method: 'GET',
                    },
                );

                if (!bookingResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const resultUserInfo = await bookingResponse.json();
                if (resultUserInfo.isSuccess) {
                    const userData = resultUserInfo.body;
                    const formattedApiData = {
                        carId: userData.carId || '',
                        startDate: userData.startDate || '',
                        bookingNumber: userData.bookingNumber || '',
                        endDate: userData.endDate || '',
                        carName: userData.carName || '',
                        basePrice: userData.basePrice || '',
                        totalAmount: userData.totalAmount || '',
                        deposit: userData.deposit || '',
                        status: userData.status || '',
                        city: userData.city || '',
                        detailAddress: userData.detailAddress || '',
                        district: userData.district || '',
                        dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
                        license: userData.license || '',
                        name: userData.name || '',
                        nationalId: userData.nationalId || '',
                        phone: userData.phone || '',
                        ward: userData.ward || '',
                        email: userData.email || '',
                        cityDriver: userData.cityDriver || '',
                        detailAddressDriver: userData.detailAddressDriver || '',
                        districtDriver: userData.districtDriver || '',
                        dobDriver: userData.dobDriver
                            ? new Date(userData.dob).toISOString().split('T')[0]
                            : '',
                        driverLicense: userData.driverLicense || '',
                        nameDriver: userData.nameDriver || '',
                        nationalIdDriver: userData.nationalIdDriver || '',
                        phoneDriver: userData.phoneDriver || '',
                        wardDriver: userData.wardDriver || '',
                        emailDriver: userData.emailDriver || '',
                    };
                    if (resultUserInfo.body.license || resultUserInfo.body.driverLicense) {
                        const url = await fetchImageURL(resultUserInfo.body.license);
                        setImageUrl(url);
                        const urlDriver = await fetchImageURL(resultUserInfo.body.driverLicense);
                        setImageUrlDriver(urlDriver);
                    }
                    setFormData(formattedApiData);
                    const startDate = new Date(userData.startDate);
                    const endDate = new Date(userData.endDate);
                    const timeDiff = endDate - startDate;
                    const daysDiff = timeDiff / (1000 * 60 * 60 * 24) + 1;
                    const roundedDays = Math.round(daysDiff);
                    setNumberOfDays(roundedDays);
                    const carResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/detail?id=${userData.carId}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionToken}`,
                            },
                        },
                    );

                    if (!carResponse.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const carResponseJson = await carResponse.json();
                    if (carResponseJson.isSuccess) {
                        const carResponseBody = carResponseJson.body;
                        const formatResponse = {
                            id: carResponseBody.id || '',
                            licensePlate: carResponseBody.licensePlate || '',
                            color: carResponseBody.color || '',
                            numberOfSeats: carResponseBody.numberOfSeats || '',
                            productionYear: carResponseBody.productionYear || '',
                            transmissionType: carResponseBody.transmissionType || '',
                            fuelType: carResponseBody.fuelType || '',
                            fuelConsumption: carResponseBody.fuelConsumption || '',
                            mileage: carResponseBody.mileage || '',
                            basePrice: carResponseBody.basePrice || '',
                            deposit: carResponseBody.deposit || '',
                            description: carResponseBody.description || '',
                            frontImage: carResponseBody.frontImage || '',
                            backImage: carResponseBody.backImage || '',
                            leftImage: carResponseBody.leftImage || '',
                            rightImage: carResponseBody.rightImage || '',
                            address: carResponseBody.address || '', //todo: add ward, district, province
                            ward: carResponseBody.ward || '',
                            district: carResponseBody.district || '',
                            province: carResponseBody.province || '',
                            carStatus: carResponseBody.carStatus || '',
                            model: carResponseBody.model || '',
                            brand: carResponseBody.brand || '',
                            document: carResponseBody.document || '',
                            additionFunctions: carResponseBody.additionFunctions || '',
                            TermOfUses: carResponseBody.termOfUses || '',
                            rate: carResponseBody.rate || 0,
                        };
                        setData(formatResponse);

                        // Fetch ảnh xe
                        if (formatResponse.frontImage) {
                            const frontImageUrl = await fetchImageURL(formatResponse.frontImage);
                            setImage((prev) => [
                                ...prev,
                                {
                                    imgURL: frontImageUrl,
                                    imgAlt: 'front image',
                                },
                            ]);
                        }
                        if (formatResponse.backImage) {
                            const backImage = await fetchImageURL(formatResponse.backImage);
                            setImage((prev) => [
                                ...prev,
                                {
                                    imgURL: backImage,
                                    imgAlt: 'back image',
                                },
                            ]);
                        }
                        if (formatResponse.leftImage) {
                            const leftImage = await fetchImageURL(formatResponse.leftImage);
                            setImage((prev) => [
                                ...prev,
                                {
                                    imgURL: leftImage,
                                    imgAlt: 'left image',
                                },
                            ]);
                        }
                        if (formatResponse.rightImage) {
                            const rightImage = await fetchImageURL(formatResponse.rightImage);
                            setImage((prev) => [
                                ...prev,
                                {
                                    imgURL: rightImage,
                                    imgAlt: 'right image',
                                },
                            ]);
                        }
                    }
                    const addressResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/address`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionToken}`,
                            },
                        },
                    );
                    const resultAddressInfo = await addressResponse.json();
                    if (!resultAddressInfo.status === 200) {
                        throw new Error('Network response was not ok');
                    }
                    setProvinces(resultAddressInfo.body);
                    const [additionFunctionResponse, termOfUseResponse, walletResponse] =
                        await Promise.all([
                            fetch(
                                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/addition/addition-function`,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${sessionToken}`,
                                    },
                                },
                            ),
                            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/addition/term-use`, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${sessionToken}`,
                                },
                            }),
                            fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/wallet/get`, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${sessionToken}`,
                                },
                            }),
                        ]);

                    if (
                        !additionFunctionResponse.ok ||
                        !termOfUseResponse.ok ||
                        !walletResponse.ok
                    ) {
                        throw new Error('Network response was not ok');
                    }

                    const additionFunctionJson = await additionFunctionResponse.json();
                    const termOfUseJson = await termOfUseResponse.json();
                    const walletJson = await walletResponse.json();

                    if (additionFunctionJson.isSuccess) {
                        setAdditionFunctionList(additionFunctionJson.body);
                    }
                    if (termOfUseJson.isSuccess) {
                        setTermOfUses(termOfUseJson.body);
                    }
                    if (walletJson.isSuccess) {
                        setWallet(walletJson.body.balance);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [bookingId, sessionToken]);
    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;
        setSelectedProvince(provinceId);

        setFormData((prev) => ({
            ...prev,
            city: provinceName,
            district: '',
            ward: '',
        }));

        const provinceFilter = provinces.find((province) => province.id === parseInt(provinceId));
        if (provinceFilter) {
            setDistricts(provinceFilter.districtResponses);
        } else {
            setDistricts([]);
        }

        setSelectedDistrict('');
        setSelectedWard('');
    };
    const handleDistrictChange = (e) => {
        const selectedDistrictId = e.target.value;
        setSelectedDistrict(selectedDistrictId);
        setFormData((prev) => ({
            ...prev,
            district: e.target.options[e.target.selectedIndex].text,
            ward: '',
        }));
        const selectedDistrictData = districts.find(
            (district) => district.id === parseInt(selectedDistrictId),
        );
        if (selectedDistrictData) {
            setWards(selectedDistrictData.wardResponses);
        } else {
            setWards([]);
        }
        setSelectedWard('');
    };

    const handleWardChange = (e) => {
        const selectedWardId = e.target.value;
        setSelectedWard(selectedWardId);
        setFormData((prev) => ({
            ...prev,
            ward: e.target.options[e.target.selectedIndex].text,
        }));
    };

    const handleDriverProvinceChange = (e) => {
        const provinceId = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;
        setSelectedProvinceDriver(provinceId);

        setFormData((prev) => ({
            ...prev,
            cityDriver: provinceName,
            districtDriver: '',
            wardDriver: '',
        }));

        const provinceFilter = provinces.find((province) => province.id === parseInt(provinceId));
        if (provinceFilter) {
            setDistricts(provinceFilter.districtResponses);
        } else {
            setDistricts([]);
        }

        setSelectedDistrictDriver('');
        setSelectedWardDriver('');
    };
    const handleDriverDistrictChange = (e) => {
        const selectedDistrictId = e.target.value;
        setSelectedDistrictDriver(selectedDistrictId);
        setFormData((prev) => ({
            ...prev,
            districtDriver: e.target.options[e.target.selectedIndex].text,
            wardDriver: '',
        }));
        const selectedDistrictData = districts.find(
            (district) => district.id === parseInt(selectedDistrictId),
        );
        if (selectedDistrictData) {
            setWards(selectedDistrictData.wardResponses);
        } else {
            setWards([]);
        }
        setSelectedWardDriver('');
    };

    const handleDriverWardChange = (e) => {
        const selectedWardId = e.target.value;
        setSelectedWardDriver(selectedWardId);
        setFormData((prev) => ({
            ...prev,
            wardDriver: e.target.options[e.target.selectedIndex].text,
        }));
    };
    function handleOnChange(e) {
        const { name, value, type } = e.target;
        if (type === 'radio') {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }
    const validateForm = () => {
        const {
            emailDriver,
            email,
            phone,
            nationalId,
            phoneDriver,
            nationalIdDriver,
            ward,
            wardDriver,
            district,
            districtDriver,
            city,
            cityDriver,
        } = formData;
        const regex = new RegExp(/^\+\d{1,3}\d{9}$/);
        if (!phone || !nationalId) {
            return 'Phone and National ID are required';
        }
        if (!regex.test(phone)) {
            return 'Phone number must contain  +  and followed by digits';
        }
        if (!phoneDriver || !nationalIdDriver) {
            return 'Phone and National ID are required';
        }
        if (!regex.test(phoneDriver)) {
            return 'Phone number must contain + and followed by digits';
        }
        if (!emailDriver || !email) {
            return 'Email are required';
        }
        if (!ward || !district || !city) {
            return 'City, district, ward of renter are required';
        }
        if (!wardDriver || !districtDriver || !cityDriver) {
            return 'City, district, ward of driver are required';
        }
    };
    const isDisabled = !['CONFIRMED', 'PENDING_DEPOSIT'].includes(formData.status);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (validateForm()) {
            setError(validateForm());
            setLoading(false);
            return;
        }
        const form = new FormData();
        form.append('file', imageRequest);
        form.append('fileDriver', imageRequestDriver);
        form.append('data', JSON.stringify(formData));
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/${bookingId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: form,
                },
            );
            const rs = await response.json();
            if (response.ok) {
                alert('Update booking successfully');
                setError(false);
                router.refresh();
            } else {
                setError(rs.error.error || 'An error occurred during update booking');
            }
        } catch (error) {
            setError('An error occurred during booking car');
        } finally {
            setLoading(false);
        }
    };
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files[0].name,
        }));
        const fileURL = URL.createObjectURL(files[0]);
        switch (name) {
            case 'driverLicense':
                setImageDisplay({ src: fileURL, alt: 'driverLicense' });
                setImageRequest(e.target.files[0]);
                break;
            case 'driverLicenseDriver':
                setImageDisplayDriver({ src: fileURL, alt: 'driverLicenseDriver' });
                setImageRequestDriver(e.target.files[0]);
                break;
            default:
                break;
        }
    };
    return (
        <div>
            <AfterBookingDetails
                bookingData={formData}
                roundedDays={numberOfDays}
                images={image}
                bookingId={bookingId}
            />
            <CarInformationTab onTabClick={handleTabClick} activeTab={activeTab} />
            {activeTab === 'Booking Information' && (
                <div className="border-top border-black">
                    <form onSubmit={handleSubmit}>
                        <div className="container-fluid mt-3">
                            <div>
                                <h3 className="fw-bold ps-5">Renter's information</h3>
                                <div className="d-flex justify-content-between">
                                    <div className="col-md-4 mx-5">
                                        <div className="py-2">
                                            <label className="fw-bold">Full Name:</label>
                                            <br />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                disabled={isDisabled}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Phone Number: <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                required
                                                disabled={isDisabled}
                                            />
                                            <div className="form-text mt-3">
                                                Phone must contain '+' and be followed by numerics
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                National ID No.
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="number"
                                                name="nationalId"
                                                value={formData.nationalId || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                required
                                                disabled={isDisabled}
                                            />
                                        </div>
                                        <div className="py-2 mt-5">
                                            <h5 className="fw-bold">Address: </h5>
                                            <select
                                                value={selectedProvince || ''}
                                                onChange={handleProvinceChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                                disabled={isDisabled}
                                            >
                                                <option value="DEFAULT" disabled>
                                                    City/Province
                                                </option>
                                                <option value="" disabled>
                                                    {formData.city
                                                        ? formData.city
                                                        : 'City/Province'}
                                                </option>
                                                {provinces.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <select
                                                value={selectedDistrict || ''}
                                                onChange={handleDistrictChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                                disabled={isDisabled}
                                            >
                                                <option value="DEFAULT" disabled>
                                                    District
                                                </option>
                                                <option value="" disabled>
                                                    {formData.district
                                                        ? formData.district
                                                        : 'District'}
                                                </option>
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <select
                                                value={selectedWard || ''}
                                                onChange={handleWardChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                                disabled={isDisabled}
                                            >
                                                <option value="DEFAULT" disabled>
                                                    Ward
                                                </option>
                                                <option value="">
                                                    {formData.ward ? formData.ward : 'Select Ward'}
                                                </option>
                                                {wards.map((ward) => (
                                                    <option key={ward.id} value={ward.id}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <input
                                                type="text"
                                                name="detailAddress"
                                                value={formData.detailAddress || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                placeholder="House number, Street"
                                                disabled={isDisabled}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mx-5">
                                        <div className="py-2">
                                            <label className="fw-bold">Date of birth:</label>
                                            <br />
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                disabled={isDisabled}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Email Address:{' '}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                disabled
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Driving license.
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            {imageDisplay.src ? (
                                                <Image
                                                    style={{ width: '500px', height: '300px' }}
                                                    src={imageDisplay.src}
                                                    alt={imageDisplay.alt}
                                                    className="img-thumbnail"
                                                    width={500}
                                                    height={300}
                                                />
                                            ) : (
                                                <Image
                                                    style={{ width: '500px', height: '300px' }}
                                                    src={imageUrl}
                                                    alt="Profile"
                                                    className="img-fluid"
                                                    width={500}
                                                    height={300}
                                                />
                                            )}
                                            <input
                                                type="file"
                                                name="driverLicense"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="fw-bold mt-3 ps-5">Driver's information</h3>
                                <div className="d-flex justify-content-between">
                                    <div className="col-md-4 mx-5">
                                        <div className="py-2">
                                            <label className="fw-bold">Full Name:</label>
                                            <br />
                                            <input
                                                type="text"
                                                name="nameDriver"
                                                value={formData.nameDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                disabled={isDisabled}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Phone Number: <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="text"
                                                name="phoneDriver"
                                                value={formData.phoneDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                required
                                                disabled={isDisabled}
                                            />
                                            <div className="form-text mt-3">
                                                Phone must contain '+' and be followed by numerics
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                National ID No.
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="number"
                                                name="nationalIdDriver"
                                                value={formData.nationalIdDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                required
                                                disabled={isDisabled}
                                            />
                                        </div>
                                        <div className="py-2 mt-5">
                                            <h5 className="fw-bold">Address: </h5>
                                            <select
                                                value={selectedProvinceDriver || ''}
                                                onChange={handleDriverProvinceChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                                disabled={isDisabled}
                                            >
                                                <option value="DEFAULT" disabled>
                                                    City/Province
                                                </option>
                                                <option value="" disabled>
                                                    {formData.cityDriver
                                                        ? formData.cityDriver
                                                        : 'City/Province'}
                                                </option>
                                                {provinces.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <select
                                                value={selectedDistrictDriver || ''}
                                                onChange={handleDriverDistrictChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                                disabled={isDisabled}
                                            >
                                                <option value="DEFAULT" disabled>
                                                    District
                                                </option>
                                                <option value="" disabled>
                                                    {formData.districtDriver
                                                        ? formData.districtDriver
                                                        : 'District'}
                                                </option>
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <select
                                                value={selectedWardDriver || ''}
                                                onChange={handleDriverWardChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                                disabled={isDisabled}
                                            >
                                                <option value="DEFAULT" disabled>
                                                    Ward
                                                </option>
                                                <option value="">
                                                    {formData.wardDriver
                                                        ? formData.wardDriver
                                                        : 'Select Ward'}
                                                </option>
                                                {wards.map((ward) => (
                                                    <option key={ward.id} value={ward.id}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <input
                                                type="text"
                                                name="detailAddressDriver"
                                                value={formData.detailAddressDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                placeholder="House number, Street"
                                                disabled={isDisabled}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mx-5">
                                        <div className="py-2">
                                            <label className="fw-bold">Date of birth:</label>
                                            <br />
                                            <input
                                                type="date"
                                                name="dobDriver"
                                                value={formData.dobDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                disabled={isDisabled}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Email Address:{' '}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="email"
                                                name="emailDriver"
                                                value={formData.emailDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                disabled={isDisabled}
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Driving license.
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            {imageDisplayDriver.src ? (
                                                <Image
                                                    style={{ width: '500px', height: '300px' }}
                                                    src={imageDisplayDriver.src}
                                                    alt={imageDisplayDriver.alt}
                                                    className="img-thumbnail"
                                                    width={500}
                                                    height={300}
                                                />
                                            ) : (
                                                <Image
                                                    style={{ width: '500px', height: '300px' }}
                                                    src={imageUrlDriver}
                                                    alt="Profile"
                                                    className="img-fluid"
                                                    width={500}
                                                    height={300}
                                                />
                                            )}
                                            <input
                                                type="file"
                                                name="driverLicenseDriver"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="d-flex justify-content-center align-items-center">
                                {loading ? (
                                    <span
                                        className="spinner-border"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    <>
                                        <Link href={'/customer/booking'} className="m-2">
                                            Discard
                                        </Link>
                                        <button
                                            type="submit"
                                            className="btn btn-primary m-2"
                                            disabled={isDisabled}
                                        >
                                            Save
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            )}
            {activeTab === 'Car Information' && (
                <div className="container-fluid border-top border-black">
                    <div className="container my-3">
                        <BasicInformation data={data} />
                        <Details data={data} additionFunctions={additionFunctionList} />
                        <TermOfUses data={data} termOfUses={termOfUses} />
                    </div>
                </div>
            )}
            {activeTab === 'Payment Information' && (
                <div className="container-fluid border-top border-black">
                    <div className="container my-3 px-5">
                        <br />
                        <div className="container my-3">
                            <input
                                type="radio"
                                name="payment_option"
                                value="wallet"
                                defaultChecked
                            />
                            <label>My Wallet</label>
                            <br />
                            <p className="m-3 mb-5">
                                Current balance:{' '}
                                <span>{wallet !== null ? wallet : 'Loading...'}</span> VND
                            </p>
                        </div>
                        <p>Please make sure to have sufficient balance when you return car</p>
                        <p>
                            Go to{' '}
                            <Link href="/ewallet" className="ms-3">
                                My Wallet
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
