---
template: post.html
title: VRSified Variants
description: Variant Response in GA4GH Variant Representation Standard (VRS) Format
date: 2022-03-30
---

The variant format served through the API has now changed to a format commpatible with the
GA4GH Variant Representation Standard ([VRS](http://vrs.ga4gh.org) version (bleeding edge version...).

=== "VRSified CNV"

	```json
    {
        "caseLevelData": [
            {
                "analysisId": "pgxcs-kftwfurn",
                "biosampleId": "pgxbs-kftvj7rz",
                "id": "pgxvar-5c86664409d374f2dc4eeb93"
            }
        ],
        "variation": {
            "location": {
                "interval": {
                    "end": {
                        "type": "Number",
                        "value": 62947165
                    },
                    "start": {
                        "type": "Number",
                        "value": 23029501
                    }
                },
                "sequenceId": "refseq:NC_000018.10",
                "type": "SequenceLocation"
            },
            "relativeCopyClass": "partial loss",
            "updated": "2022-03-29T15:06:46.526020",
            "variantInternalId": "18:23029501-62947165:DEL"
        }
    }
    ```

=== "Legacy CNV"
    
    ```json
    {
        "caseLevelData": [
            {
                "analysisId": "pgxcs-kftwfurn",
                "biosampleId": "pgxbs-kftvj7rz",
                "id": "pgxvar-5c86664409d374f2dc4eeb93"
            }
        ],
        "variantInternalId": "18:23029501-62947165:DEL"
        "referenceName": "18",
        "start": 23029501,
        "end": 62947165,
        "variantType": "DEL",
        "updated": "2022-03-29T15:06:46.526020"
    }
    ```

=== "VRSified SNV"

    ```json
    {
        "caseLevelData": [
            {
                "analysisId": "pgxcs-kl8hg4ky",
                "biosampleId": "pgxbs-kl8hg4ku",
                "id": "pgxvar-5be1840772798347f0eda0d8"
            }
        ],
        "variation": {
            "location": {
                "interval": {
                    "end": {
                        "type": "Number",
                        "value": 7577121
                    },
                    "start": {
                        "type": "Number",
                        "value": 7577120
                    },
                    "type": "SequenceInterval"
                },
                "sequenceId": "refseq:NC_000017.11",
                "type": "SequenceLocation"
            },
            "state": {
                "sequence": "G",
                "type": "LiteralSequenceExpression"
            },
            "updated": "2022-03-29T15:35:35.700954",
            "variantInternalId": "17:7577121:C>G"
        }
    }
    ```

=== "Legacy SNV"

    ```json
    {
        "caseLevelData": [
            {
                "analysisId": "pgxcs-kl8hg4ky",
                "biosampleId": "pgxbs-kl8hg4ku",
                "id": "pgxvar-5be1840772798347f0eda0d8"
            }
        ],
        "variantInternalId": "17:7577121:C>G",
        "start": 7577120,
        "end": 7577121,
        "referenceName": "17",
        "referenceBases": "C",
        "alternateBases": "G",
        "updated": "2022-03-29T15:35:35.700954"
    }
    ```

