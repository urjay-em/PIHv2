import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Header = ({ title, subtitle, subtitle1, body1 }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box mb="30px">
            <Typography
            variant="h2"
            color={colors.grey[100]}
            fontWeight="bold"
            sx={{ m: "0 0 5px 0" }}
            >
                {title}
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[400]}>
                {subtitle}
            </Typography>
            {subtitle1 && (
                <Typography variant="h5" color={colors.grey[100]}>
                    {subtitle1}
                </Typography>
            )}
            {body1 && (
                <Typography variant="h5" color={colors.grey[400]}>
                    {body1}
                </Typography>
            )}
        </Box>
    );
};

export default Header;
