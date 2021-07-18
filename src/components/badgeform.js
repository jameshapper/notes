import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import { useForm, Controller } from 'react-hook-form'
import { Typography, MenuItem, Select, Grid, TextField, Button } from '@material-ui/core';

export default function BadgeForm() {

    const { handleSubmit, control, watch } = useForm();

    const onSubmit = data => {
      console.log(data);
    };

    const watchNumberOfTickets = watch('numberOfTickets');

    // return array of ticket indexes for rendering dynamic forms in the template
    function ticketNumbers() {
        return [...Array(parseInt(watchNumberOfTickets || 0)).keys()];
    }

    return (
        <div>
            <Toolbar/>

            <h2>Add the badge form here</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Controller
                            name="numberOfTickets"
                            control={control}
                            defaultValue={1}
                            render={({field}) => (
                                <Select {...field}>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                )
                                </Select>
                            )   
                            }
                        />
                    </Grid>
                    <Grid item xs={10}></Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="badgename"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Badge Name"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Badge name required' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="badgelevel"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Badge Level"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Bagde level required' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="issuer"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Issuer"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Issuer required' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                        name="totalcrits"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Total Crits"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Total crits required' }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Description required' }}
                        />
                    </Grid>
                </Grid>
                <Typography>Add Criteria Below</Typography>
                <Grid container spacing={2}>
                {ticketNumbers().map((i) => {
                return (
                    <>
                    <Grid item xs={2}>
                        <Controller
                        name={`totalcrits${i}`}
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            label="Total Crits"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Total crits required' }}
                        />
                    </Grid>
                        <Grid item xs={10}>
                        <Controller
                        name={`description${i}`}
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField
                            fullWidth
                            multiline
                            rows={1}
                            label="Description"
                            variant="filled"
                            value={value}
                            onChange={onChange}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                        )}
                        rules={{ required: 'Description required' }}
                        />
                    </Grid>
                    </>
                )
                })}
                </Grid>

                <div>
                    <Button variant="contained">
                    Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                    Signup
                    </Button>
                </div>
            </form>
        </div>
    )
}
