"use client";

import Youtube from "@tiptap/extension-youtube";
import Dropcursor from "@tiptap/extension-dropcursor";
// import { common, createLowlight } from "lowlight";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import StarterKitExtension from "@tiptap/starter-kit";
import TextAlignExtension from "@tiptap/extension-text-align";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import { useState, useEffect, forwardRef, useCallback } from "react";
import CodeBlockLowlightExtension from "@tiptap/extension-code-block-lowlight";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import CustomVideoExtension from "./extensions/custom-video-extension";

import Stack from "@mui/material/Stack";
import Portal from "@mui/material/Portal";
import Backdrop from "@mui/material/Backdrop";
import FormHelperText from "@mui/material/FormHelperText";

import { EditorContainer } from "./EditorContainer";
import { editorClasses } from "./classes";
import { CodeHighlightBlock } from "./EditorToolbar/components/code-highlight-block";
import { all, createLowlight } from "lowlight";
import type { EditorProps } from "./types";
import EditorToolbar from "./EditorToolbar";
export const Editor = forwardRef<HTMLDivElement, EditorProps>(
  (
    {
      sx,
      error,
      onChange,
      slotProps,
      helperText,
      resetValue,
      editable = true,
      fullItem = true,
      resourceItem = false,
      value: content = "",
      placeholder = "Nội dung",
      ...other
    },
    ref,
  ) => {
    const [fullScreen, setFullScreen] = useState(false);

    const handleToggleFullScreen = useCallback(() => {
      setFullScreen((prev) => !prev);
    }, []);
    const lowlight = createLowlight(all);

    const editor = useEditor({
      content,
      editable,
      immediatelyRender: false,
      extensions: [
        StarterKitExtension.configure({
          codeBlock: false,
          code: {
            HTMLAttributes: { class: editorClasses.content.codeInline },
          },
          heading: {
            HTMLAttributes: { class: editorClasses.content.heading },
          },
          horizontalRule: {
            HTMLAttributes: { class: editorClasses.content.hr },
          },
          listItem: {
            HTMLAttributes: { class: editorClasses.content.listItem },
          },
          blockquote: {
            HTMLAttributes: { class: editorClasses.content.blockquote },
          },
          bulletList: {
            HTMLAttributes: { class: editorClasses.content.bulletList },
          },
          orderedList: {
            HTMLAttributes: { class: editorClasses.content.orderedList },
          },
        }),
        PlaceholderExtension.configure({
          placeholder,
          emptyEditorClass: editorClasses.content.placeholder,
        }),
        ImageExtension.configure({
          HTMLAttributes: { class: editorClasses.content.image },
          inline: true,
        }),
        TextAlignExtension.configure({ types: ["heading", "paragraph"] }),
        LinkExtension.configure({
          autolink: true,
          openOnClick: false,
          linkOnPaste: false,
          HTMLAttributes: { class: editorClasses.content.link },
          isAllowedUri: (url) => {
            return /^(https?:\/\/|www\.)\S+/.test(url);
          },
        }),
        // CodeBlockLowlightExtension.extend({
        //   addNodeView() {
        //     return ReactNodeViewRenderer(CodeHighlightBlock);
        //   },
        // }).configure({
        //   lowlight,
        //   HTMLAttributes: { class: editorClasses.content.codeBlock },
        // }),
        Youtube.configure({
          controls: true,
          nocookie: true,
          width: 900,
          height: 600,
        }),
        Dropcursor.configure({
          width: 2,
        }),
        CustomVideoExtension,
      ],

      onUpdate({ editor: _editor }) {
        let html = _editor.getHTML();

        if (html === "<p></p>") {
          html = "";
        }

        onChange?.(html);
      },
      ...other,
    });

    useEffect(() => {
      if (!editor || content === "<p></p>") return;
      let { from, to } = editor.state.selection;
      // editor.commands.setContent(content, false, {
      //   preserveWhitespace: "full",
      // });
      editor.commands.setTextSelection({ from, to });
    }, [editor, content]);

    useEffect(() => {
      if (resetValue && !content) {
        editor?.commands.clearContent();
      }
    }, [content]);

    useEffect(() => {
      if (fullScreen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }, [fullScreen]);

    return (
      <Portal disablePortal={!fullScreen}>
        {fullScreen && (
          <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal - 1 }} />
        )}

        <Stack
          sx={{
            ...(!editable && { cursor: "not-allowed" }),
            ...slotProps?.wrap,
          }}
        >
          <EditorContainer
            error={!!error}
            disabled={!editable}
            fullScreen={fullScreen}
            className={editorClasses.root}
            sx={sx}
          >
            <EditorToolbar
              editor={editor}
              fullItem={fullItem}
              resourceItem={resourceItem}
              fullScreen={fullScreen}
              onToggleFullScreen={handleToggleFullScreen}
            />
            <EditorContent
              ref={ref}
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              editor={editor}
              className={editorClasses.content.root}
            />
          </EditorContainer>
          {helperText && (
            <FormHelperText error={!!error}>{helperText}</FormHelperText>
          )}
        </Stack>
      </Portal>
    );
  },
);
