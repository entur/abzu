import { Box } from "@mui/material";
import { getPrimaryDarkerColor } from "../config/themeConfig";
import { getIconByModality } from "../utils/iconUtils";

const modalities = [
  "onstreetBus",
  "onstreetTram",
  "railStation",
  "ferryStop",
  "multiModal",
];

const primaryDarker = getPrimaryDarkerColor();

const CustomLoadingAnimation = () => {
  return (
    <Box sx={{ display: "flex", gap: "16px" }}>
      {modalities.map((modality, index) => {
        const iconUrl = getIconByModality(modality, modality === "multiModal");

        return (
          <Box
            key={index}
            sx={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: primaryDarker,
              borderRadius: "50%",
              animation: "wave 1.8s ease-in-out infinite",
              animationDelay: `${index * 0.15}s`,
              "@keyframes wave": {
                "0%, 100%": {
                  transform: "translateY(0)",
                },
                "50%": {
                  transform: "translateY(-20px)",
                },
              },
            }}
          >
            <Box
              sx={{
                width: "60%",
                height: "60%",
                backgroundImage: `url(${iconUrl})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default CustomLoadingAnimation;
