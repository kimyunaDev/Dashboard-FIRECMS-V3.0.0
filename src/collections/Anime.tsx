import { buildCollection, buildProperty } from "@firecms/core";

export const AnimeCollection = buildCollection({
    id: "anime",
    name: "Anime",
    description: "Anime collection",
    //Es la ruta de la base de datos
    path: "anime",
    properties: {
        title: buildProperty({
            name: "Title",
            dataType: "string",
            validation: { required: true },
            description: "Anime titulo",
        }),
        description: buildProperty({
            name: "Description",
            dataType: "string",
            validation: { required: true },
            description: "Anime description",
        }),
        img: buildProperty({
            name: "Image",
            dataType: "string",
            description: "Anime image",
            validation: { required: true },
        }),
        publish_date: buildProperty({
            name: "Publish date",
            dataType: "date",
            autoValue: 'on_create',
        }),

    }

    });