import { Add, VerticalSplit } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton, Stack } from "@mui/material";
import profile from "../assets/profile.png";

const SettingBar = () => {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton>
          <VerticalSplit />
        </IconButton>
        {/* <Checkbox icon={<LightMode />} checkedIcon={<DarkMode />} /> */}
        <IconButton>
          <Avatar src={profile} />
        </IconButton>
      </Box>

      <Button
        sx={{
          alignItems: "center",
          backgroundColor: "primary.dark",
        }}
        variant="contained"
        startIcon={<Add />}
      >
        New Chat
      </Button>
    </Stack>
  );
};

export default SettingBar;
