package com.example.backend.entity;

import com.example.backend.request.RefeicaoRequest;
import com.example.backend.response.DietaResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Dieta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    @ManyToOne
    private User alunoId;
    @ManyToOne
    private User nutrilId;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Refeicoes> refeicoes;
    private byte[] arquivoPdf;


}
