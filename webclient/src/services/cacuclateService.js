import { toast } from "react-toastify";

export const getTaxByMonth = (salaryTax) => {
    if (salaryTax <= 0) return 0; // Thêm kiểm tra trường hợp âm hoặc bằng 0
    switch (true) {
        case salaryTax <= 5:
            return 0.05 * salaryTax;
        case salaryTax <= 10:
            return 0.10 * salaryTax - 0.25;
        case salaryTax <= 18:
            return 0.15 * salaryTax - 0.75;
        case salaryTax <= 32:
            return 0.20 * salaryTax - 1.65;
        case salaryTax <= 52:
            return 0.25 * salaryTax - 3.25;
        case salaryTax <= 80:
            return 0.30 * salaryTax - 5.85;
        default:
            return 0.35 * salaryTax - 9.85; // Xử lý trường hợp lớn hơn 80
    }
};

export const getSalaryTax = (salary, num_dependent) => {
    if (salary < 0) {
        toast.warn("Lương cơ bản phải lớn hơn  0"); // Bảo vệ đầu vào
    }

    const _salary = salary / 1000000; // Chuyển sang triệu
    const deduction = 11 + num_dependent * 4.4; // Tính các khoản giảm trừ
    const salaryWithTax = Math.max(0, _salary - deduction); // Tránh giá trị âm
    const tax = getTaxByMonth(salaryWithTax); // Tính thuế
    const total_salary = _salary - tax; // Tính lương thực nhận

    return {
        salary: salary, // Lương ban đầu
        deduction: deduction * 1000000, // Chuyển giảm trừ về VNĐ
        tax: Math.round(tax * 1000000), // Làm tròn thuế
        total_salary: Math.round(total_salary * 1000000) // Làm tròn lương thực nhận
    };
};

export const getTaxByYear = (salaryTax) => {
    if (salaryTax <= 0) return 0; // Thêm kiểm tra trường hợp âm hoặc bằng 0
    switch (true) {
        case salaryTax <= 60:
            return 0.05 * salaryTax;
        case salaryTax <= 120:
            return 0.10 * salaryTax - 3;
        case salaryTax <= 216:
            return 0.15 * salaryTax - 9;
        case salaryTax <= 384:
            return 0.20 * salaryTax - 19.8;
        case salaryTax <= 624:
            return 0.25 * salaryTax - 39;
        case salaryTax <= 960:
            return 0.30 * salaryTax - 70.2;
        default:
            return 0.35 * salaryTax - 118.2; // Xử lý trường hợp lớn hơn 80
    }
};


export const getSalaryTaxOfYear = (data) => {
    let _total_salary = 0; // Chuyển sang triệu
    let _total_deduction = 0;
    let _total_tax = 0;

    data.forEach((item) => {
        _total_salary += item.salary / 1000000;
        _total_deduction += item.deduction / 1000000;
        _total_tax += item.tax / 1000000;
    });

    const _salary_tax = Math.max(0, _total_salary - _total_deduction);
    const tax = getTaxByYear(_salary_tax);
    console.log(tax, _total_tax)
    return {
        total_salary: customRound(_total_salary * 1000000), // Lương ban đầu làm tròn
        total_deduction: customRound(_total_deduction * 1000000), // Giảm trừ làm tròn về VNĐ
        total_tax_month: customRound(_total_tax * 1000000), // Thuế làm tròn về VNĐ
        tax_year: customRound(tax * 1000000),
        bol: customRound(tax) - customRound(_total_tax) >= 0 ? true : false, // Thuế năm làm tròn
        result: customRound(Math.abs((tax - _total_tax) * 1000000)) // Chênh lệch làm tròn
    };
};

export const customRound = (value, decimalPlaces = 0) => {
    const factor = 10 ** decimalPlaces;
    return Math.floor(value * factor + 0.5) / factor;
};


