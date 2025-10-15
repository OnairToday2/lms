export const SELECT_CLASS_ROOM = `
        id,
        title,
        description,
        thumbnail_url,
        status,
        room_type,
        created_at,
        updated_at,
        start_at,
        end_at,
        slug,
        class_sessions (
          id,
          title,
          description,
          start_at,
          end_at,
          is_online,
          channel_provider,
          channel_info
        )
`