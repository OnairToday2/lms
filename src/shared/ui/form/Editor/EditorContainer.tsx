import type { StackProps } from "@mui/material/Stack";

import Stack from "@mui/material/Stack";
import { styled, alpha } from "@mui/material/styles";

import { editorClasses } from "./classes";

const MARGIN = "0.75em";

type EditorContainerProps = StackProps & {
  error?: boolean;
  disabled?: boolean;
  fullScreen?: boolean;
};
export const EditorContainer = styled(Stack, {
  shouldForwardProp: (prop) =>
    prop !== "error" && prop !== "disabled" && prop !== "fullScreen",
})<EditorContainerProps>(({ error, disabled, fullScreen, theme }) => ({
  minHeight: 360,
  maxHeight: 650,
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
  scrollbarWidth: "thin",
  scrollbarColor: `${alpha(theme.palette.grey[500], 0.4)} ${alpha(
    theme.palette.grey[500],
    0.08,
  )}`,

  /**
   * State: error
   */
  ...(error && {
    border: `solid 1px ${theme.palette.error.main}`,
  }),
  /**
   * State: disabled
   */
  ...(disabled && {
    opacity: 0.48,
    pointerEvents: "none",
  }),
  /**
   * State: fullScreen
   */
  ...(fullScreen && {
    top: 16,
    left: 16,
    position: "fixed",
    zIndex: theme.zIndex.modal,
    maxHeight: "unset !important",
    width: `calc(100% - ${32}px)`,
    height: `calc(100% - ${32}px)`,
    backgroundColor: theme.palette.background.default,
  }),
  /**
   * Placeholder
   */
  [`.${editorClasses.content.root}`]: {
    scrollbarWidth: "thin",
  },
  [`& .${editorClasses.content.placeholder}`]: {
    "&:first-of-type::before": {
      ...theme.typography.body2,
      height: 0,
      float: "left",
      pointerEvents: "none",
      content: "attr(data-placeholder)",
      color: theme.palette.text.disabled,
    },
  },
  /**
   * Content
   */
  [`& .${editorClasses.content.root}`]: {
    display: "flex",
    flex: "1 1 auto",
    overflowY: "auto",
    flexDirection: "column",
    borderBottomLeftRadius: "inherit",
    borderBottomRightRadius: "inherit",
    backgroundColor: alpha(theme.palette.grey[500], 0.08),
    ...(error && {
      backgroundColor: alpha(theme.palette.error.main, 0.08),
    }),
    "& .tiptap": {
      "> * + *": {
        marginTop: 0,
        marginBottom: MARGIN,
      },
      "&.ProseMirror": {
        flex: "1 1 auto",
        outline: "none",
        padding: theme.spacing(2, 2),
      },
      /**
       * Heading & Paragraph
       */
      h1: { ...theme.typography.h1, marginTop: 40, marginBottom: 8 },
      h2: { ...theme.typography.h2, marginTop: 40, marginBottom: 8 },
      h3: { ...theme.typography.h3, marginTop: 24, marginBottom: 8 },
      h4: { ...theme.typography.h4, marginTop: 24, marginBottom: 8 },
      h5: { ...theme.typography.h5, marginTop: 24, marginBottom: 8 },
      h6: { ...theme.typography.h6, marginTop: 24, marginBottom: 8 },
      p: { ...theme.typography.body1, marginBottom: "1rem" },
      [`& .${editorClasses.content.heading}`]: {},
      /**
       * Link
       */
      [`& .${editorClasses.content.link}`]: {
        color: theme.palette.primary.main,
      },
      /**
       * Hr Divider
       */
      [`& .${editorClasses.content.hr}`]: {
        flexShrink: 0,
        borderWidth: 0,
        margin: "2em 0",
        msFlexNegative: 0,
        WebkitFlexShrink: 0,
        borderStyle: "solid",
        borderBottomWidth: "thin",
        borderColor: theme.palette.divider,
      },
      /**
       * Image
       */ [`& .${editorClasses.content.image}`]: {
        // width: "100%",
        height: "auto",
        maxWidth: "100%",
        margin: "auto auto 1em",
      },
      /**
       * List
       */ [`& .${editorClasses.content.bulletList}`]: {
        paddingLeft: 20,
        margin: "1rem 0",
        listStyleType: "disc",
      },
      [`& .${editorClasses.content.orderedList}`]: {
        paddingLeft: 20,
      },
      [`& .${editorClasses.content.listItem}`]: {
        lineHeight: 1.5,
        [`&+ .${editorClasses.content.listItem}`]: {
          marginTop: "0.5rem",
        },
        "& > p": {
          ...theme.typography.body1,
          margin: 0,
          display: "inline-block",
        },
      },
      [`& .${editorClasses.content.listItem}::marker`]: {
        fontVariantNumeric: "normal !important",
      },
      /**
       * Blockquote
       */
      [`& .${editorClasses.content.blockquote}`]: {
        lineHeight: 1.5,
        fontSize: "1.325rem",
        backgroundColor: "white",
        margin: "12px 36px",
        position: "relative",
        fontFamily: "Georgia, serif",
        padding: theme.spacing(2, 2, 2, 6),
        color: theme.palette.text.secondary,
        borderLeft: `solid 6px ${alpha(theme.palette.grey["500"], 0.3)}`,
        "& p": {
          margin: 0,
          fontSize: "inherit",
          fontFamily: "inherit",
        },
        "&::before": {
          left: 16,
          top: -8,
          display: "block",
          fontSize: "3em",
          content: '"\\""',
          position: "absolute",
          color: theme.palette.grey[400],
        },
      },
      /**
       * Code inline
       */
      [`& .${editorClasses.content.codeInline}`]: {
        padding: theme.spacing(0.25, 0.5),
        color: theme.palette.text.secondary,
        fontSize: theme.typography.body2.fontSize,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.grey[500], 0.2),
      },
      /**
       * Code block
       */
      [`& .${editorClasses.content.codeBlock}`]: {
        position: "relative",
        "& pre": {
          overflowX: "auto",
          color: theme.palette.common.white,
          padding: theme.spacing(5, 3, 3, 3),
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.grey[900],
          fontFamily: "'JetBrainsMono', monospace",
          "& code": { fontSize: theme.typography.body2.fontSize },
        },
        [`& .${editorClasses.content.langSelect}`]: {
          top: 8,
          right: 8,
          zIndex: 1,
          padding: 4,
          outline: "none",
          borderRadius: 4,
          position: "absolute",
          color: theme.palette.common.white,
          fontWeight: theme.typography.fontWeightMedium,
          borderColor: alpha(theme.palette.grey[500], 0.08),
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
        },
      },
    },
  },
}));
