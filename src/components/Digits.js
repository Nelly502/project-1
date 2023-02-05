export const Digits = ({ value }) => {
    const digits = `0000${value}`.split('').slice(-3);

    return (
        <div className="digits">
            {digits.map((e, i) => (
                <div className={`digit value${e}`}></div>
            ))}
        </div>
    );
};
