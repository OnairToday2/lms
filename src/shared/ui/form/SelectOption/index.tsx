import React, { useMemo } from 'react';

import { Select, MenuItem, InputLabel, FormControl, FormHelperText, SelectChangeEvent } from '@mui/material';

interface OPTION {
    value: string,
    label: string,
}

interface PropTypes {
    inputLabel: string;
    name?: string,
    value: string;
    onChange: (v) => void,
    error?: {
        message?: string,
    },
    options?: OPTION[] | undefined
}

export const SelectOption: React.FC<PropTypes> = (props) => {
    const { inputLabel, value = '', name, onChange, error, options = [], ...others } = props;

    const labelId = `${name}-select-option`;

    const handleChange = React.useCallback((event: SelectChangeEvent) => {
        onChange(event.target.value);
    }, [onChange]);

    const renderMoreItem = useMemo(() => {
        if (options && options.length > 0) {
            return options.map((item, index) => {
                return <MenuItem key={`${item.value}_${index}`} value={item.value}>{item.label}</MenuItem>;
            });
        }
        return null;
    }, [options]);

    return (
        <FormControl
            fullWidth
            error={!!error}
        >
            <InputLabel id={labelId}>{inputLabel}</InputLabel>
            <Select
                label={inputLabel}
                labelId={labelId}
                value={value}
                onChange={handleChange}
                {...others}
            >
                {renderMoreItem}
            </Select>
            {error?.message && <FormHelperText>{error?.message} </FormHelperText>}
        </FormControl>
    );
};
