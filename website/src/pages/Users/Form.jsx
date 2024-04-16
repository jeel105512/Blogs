import React from "react";

const Form = ({ user, setUser, submitForm, submitLabel }) => {
    // Ensure user object has default properties to avoid inputs being uncontrolled initially
    const getUserProp = (prop) => user && user[prop] ? user[prop] : '';

    return (
        <form onSubmit={submitForm} className="bg-dark text-light p-4 rounded">
            <div className="form-group my-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstName" name="firstName" onChange={(e) => setUser({ ...user, firstName: e.target.value })} value={getUserProp('firstName')} />
            </div>

            <div className="form-group my-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastName" name="lastName" onChange={(e) => setUser({ ...user, lastName: e.target.value })} value={getUserProp('lastName')} />
            </div>

            <div className="form-group my-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" onChange={(e) => setUser({ ...user, email: e.target.value })} value={getUserProp('email')} />
            </div>

            <div className="form-group my-3">
                <label htmlFor="nickname" className="form-label">Nickname</label>
                <input type="text" className="form-control" id="nickname" name="nickname" onChange={(e) => setUser({ ...user, nickname: e.target.value })} value={getUserProp('nickname')} />
            </div>

            <div className="form-group my-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password" onChange={(e) => setUser({ ...user, password: e.target.value })} value={getUserProp('password') || ''} />
            </div>

            <div className="form-group my-3">
                <label htmlFor="avatar" className="form-label">Avatar</label>
                <input type="file" className="form-control" id="avatar" name="avatar" onChange={(e) => setUser({ ...user, avatar: e.target.files[0] })} />
            </div>

            <div className="form-group my-3">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="subscriber"
                        name="subscriber"
                        onChange={(e) => setUser({ ...user, subscriber: e.target.checked })}
                        checked={getUserProp("subscriber")}
                    />
                    <label htmlFor="subscriber" className="form-check-label">Subscribe to stay up to date</label>
                </div>
            </div>

            <button type="submit" className="btn btn-primary">
                {submitLabel}
            </button>
        </form>
    );
};

export default Form;
