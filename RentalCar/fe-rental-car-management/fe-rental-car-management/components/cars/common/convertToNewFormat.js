export default function convertToNewFormat(oldData, page, size, filterBy) {
    const { pickUpLocation, pickUpDate, dropOffDate, pickUpTime, dropOffTime } = oldData;

    const newFormat = {
        location: pickUpLocation,
        start: `${pickUpDate} ${pickUpTime}`,
        end: `${dropOffDate} ${dropOffTime}`,
        page: page,
        size: size,
        sort: filterBy,
    };

    return newFormat;
}