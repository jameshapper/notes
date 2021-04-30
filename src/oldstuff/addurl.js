import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

export default function AddUrl() {
    // form validation rules 
    const validationSchema = Yup.object().shape({
        numberOfLinks: Yup.string()
            .required('Number of links is required'),
        links: Yup.array().of(
            Yup.object().shape({
                name: Yup.string()
                    .required('Name is required'),
                link: Yup.string()
                    .url('Link is Invalid')
                    .required('Link is required')
            })
        )
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, errors, watch } = useForm({
        resolver: yupResolver(validationSchema)
    });

    // watch to enable re-render when link number is changed
    const watchnumberOfLinks = watch('numberOfLinks');

    // return array of link indexes for rendering dynamic forms in the template
    function linkNumbers() {
        return [...Array(parseInt(watchnumberOfLinks || 0)).keys()];
    }

    function onSubmit(data) {
        // display form data on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <div className="card m-3">
                <h5 className="card-header">Add links to evidence?</h5>
                <div className="card-body border-bottom">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Number of Links to Add</label>
                            <select name="numberOfLinks" ref={register} className={`form-control ${errors.numberOfLinks ? 'is-invalid' : ''}`}>
                                {['',1,2,3,4,5,6].map(i => 
                                    <option key={i} value={i}>{i}</option>
                                )}
                            </select>
                            <div className="invalid-feedback">{errors.numberOfLinks?.message}</div>
                        </div>
                    </div>
                </div>
                {linkNumbers().map(i => (
                    <div key={i} className="list-group list-group-flush">
                        <div className="list-group-item">
                            <h5 className="card-title">link {i + 1}</h5>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Name</label>
                                    <input name={`links[${i}]name`} ref={register} type="text" className={`form-control ${errors.links?.[i]?.name ? 'is-invalid' : '' }`} />
                                    <div className="invalid-feedback">{errors.links?.[i]?.name?.message}</div>
                                </div>
                                <div className="form-group col-6">
                                    <label>Link Url</label>
                                    <input name={`links[${i}]email`} ref={register} type="text" className={`form-control ${errors.links?.[i]?.email ? 'is-invalid' : '' }`} />
                                    <div className="invalid-feedback">{errors.links?.[i]?.email?.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="card-footer text-center border-top-0">
                    <button type="submit" className="btn btn-primary mr-1">
                        Submit Links
                    </button>
                    <button className="btn btn-secondary mr-1" type="reset">Reset</button>
                </div>
            </div>
        </form>
    )
}